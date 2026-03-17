/**
 * Knowledge Graph Query Endpoint
 *
 * POST /api/v1/ai/graph/{graph}/query
 *
 * Performs SQL-based graph queries on user knowledge graphs.
 * Supports traverse, neighbors, path, and subgraph queries.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  validateTokenAndGetUser,
  requireSourceAuthorization,
} from '@/lib/auth/token-auth'
import {
  GraphQueryInputSchema,
  GraphNameSchema,
  type GraphQueryResponse,
  type GraphNode,
  type GraphEdge,
} from '@/lib/validations/ai-data-access'

/**
 * POST /api/v1/ai/graph/[graph]/query
 *
 * Request body:
 * - query_type: traverse | neighbors | path | subgraph
 * - start_node: Starting node UUID (required for traverse, neighbors, path)
 * - end_node: Ending node UUID (required for path)
 * - node_types: Filter by node types
 * - edge_types: Filter by edge types
 * - max_depth: Maximum traversal depth (default: 2)
 * - limit: Maximum results (default: 100)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ graph: string }> }
) {
  try {
    const { graph } = await params

    // Validate graph name
    const graphResult = GraphNameSchema.safeParse(graph)
    if (!graphResult.success) {
      return NextResponse.json(
        { error: `Invalid graph name: ${graph}. Valid graphs: user_knowledge, insight_network` },
        { status: 400 }
      )
    }

    // Parse request body
    const body = await request.json()
    const inputResult = GraphQueryInputSchema.safeParse(body)
    if (!inputResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: inputResult.error.issues },
        { status: 400 }
      )
    }

    const input = inputResult.data

    // Check authorization
    const authHeader = request.headers.get('authorization')
    const authResult = await validateTokenAndGetUser(authHeader)

    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.statusCode }
      )
    }

    const authError = requireSourceAuthorization(
      authResult.context,
      'knowledge_graph'
    )
    if (authError) {
      return NextResponse.json(
        { error: authError.error },
        { status: authError.statusCode }
      )
    }

    const userId = authResult.context.userId
    const supabase = await createClient()

    const nodes: GraphNode[] = []
    const edges: GraphEdge[] = []
    let depthReached = 0

    switch (input.query_type) {
      case 'neighbors': {
        // Get immediate neighbors of a node
        if (!input.start_node) {
          return NextResponse.json(
            { error: 'start_node is required for neighbors query' },
            { status: 400 }
          )
        }

        // Get the start node
        const { data: startNode, error: startError } = await supabase
          .from('graph_nodes')
          .select('id, node_type, node_data')
          .eq('id', input.start_node)
          .eq('user_id', userId)
          .single()

        if (startError || !startNode) {
          return NextResponse.json(
            { error: 'Start node not found' },
            { status: 404 }
          )
        }

        nodes.push({
          id: startNode.id,
          type: startNode.node_type,
          data: startNode.node_data || {},
        })

        // Get edges from the start node
        let edgesQuery = supabase
          .from('graph_edges')
          .select('id, source_node_id, target_node_id, edge_type, edge_data')
          .eq('user_id', userId)
          .or(`source_node_id.eq.${input.start_node},target_node_id.eq.${input.start_node}`)

        if (input.edge_types && input.edge_types.length > 0) {
          edgesQuery = edgesQuery.in('edge_type', input.edge_types)
        }

        const { data: edgesData, error: edgesError } = await edgesQuery.limit(input.limit)

        if (edgesError) {
          console.error('Edges query error:', edgesError)
          return NextResponse.json(
            { error: 'Failed to query edges' },
            { status: 500 }
          )
        }

        // Collect unique neighbor node IDs
        const neighborIds = new Set<string>()
        for (const edge of edgesData || []) {
          if (edge.source_node_id === input.start_node) {
            neighborIds.add(edge.target_node_id)
          } else {
            neighborIds.add(edge.source_node_id)
          }
        }

        // Get neighbor nodes
        if (neighborIds.size > 0) {
          let nodesQuery = supabase
            .from('graph_nodes')
            .select('id, node_type, node_data')
            .eq('user_id', userId)
            .in('id', Array.from(neighborIds))

          if (input.node_types && input.node_types.length > 0) {
            nodesQuery = nodesQuery.in('node_type', input.node_types)
          }

          const { data: neighborsData, error: neighborsError } = await nodesQuery

          if (neighborsError) {
            console.error('Neighbors query error:', neighborsError)
          } else if (neighborsData) {
            for (const neighbor of neighborsData) {
              nodes.push({
                id: neighbor.id,
                type: neighbor.node_type,
                data: neighbor.node_data || {},
              })
            }
          }
        }

        // Add edges
        for (const edge of edgesData || []) {
          edges.push({
            id: edge.id,
            source: edge.source_node_id,
            target: edge.target_node_id,
            type: edge.edge_type,
            data: edge.edge_data,
          })
        }

        depthReached = 1
        break
      }

      case 'traverse': {
        // Traverse from a start node up to max_depth
        if (!input.start_node) {
          return NextResponse.json(
            { error: 'start_node is required for traverse query' },
            { status: 400 }
          )
        }

        // BFS traversal
        const visited = new Set<string>([input.start_node])
        const queue: { nodeId: string; depth: number }[] = [
          { nodeId: input.start_node, depth: 0 },
        ]

        // Get start node
        const { data: startNode } = await supabase
          .from('graph_nodes')
          .select('id, node_type, node_data')
          .eq('id', input.start_node)
          .eq('user_id', userId)
          .single()

        if (startNode) {
          nodes.push({
            id: startNode.id,
            type: startNode.node_type,
            data: startNode.node_data || {},
          })
        }

        while (queue.length > 0 && nodes.length < input.limit) {
          const current = queue.shift()!
          if (current.depth >= input.max_depth) continue

          // Get edges from current node
          let edgesQuery = supabase
            .from('graph_edges')
            .select('id, source_node_id, target_node_id, edge_type, edge_data')
            .eq('user_id', userId)
            .eq('source_node_id', current.nodeId)

          if (input.edge_types && input.edge_types.length > 0) {
            edgesQuery = edgesQuery.in('edge_type', input.edge_types)
          }

          const { data: outEdges } = await edgesQuery.limit(50)

          for (const edge of outEdges || []) {
            edges.push({
              id: edge.id,
              source: edge.source_node_id,
              target: edge.target_node_id,
              type: edge.edge_type,
              data: edge.edge_data,
            })

            const targetId = edge.target_node_id
            if (!visited.has(targetId)) {
              visited.add(targetId)
              queue.push({ nodeId: targetId, depth: current.depth + 1 })

              // Get target node
              const { data: targetNode } = await supabase
                .from('graph_nodes')
                .select('id, node_type, node_data')
                .eq('id', targetId)
                .eq('user_id', userId)
                .single()

              if (
                targetNode &&
                (!input.node_types ||
                  input.node_types.length === 0 ||
                  input.node_types.includes(targetNode.node_type))
              ) {
                nodes.push({
                  id: targetNode.id,
                  type: targetNode.node_type,
                  data: targetNode.node_data || {},
                })
                depthReached = Math.max(depthReached, current.depth + 1)
              }
            }
          }
        }
        break
      }

      case 'subgraph': {
        // Get a subgraph based on filters without a specific start node
        let nodesQuery = supabase
          .from('graph_nodes')
          .select('id, node_type, node_data')
          .eq('user_id', userId)

        if (input.node_types && input.node_types.length > 0) {
          nodesQuery = nodesQuery.in('node_type', input.node_types)
        }

        const { data: nodesData, error: nodesError } = await nodesQuery.limit(input.limit)

        if (nodesError) {
          console.error('Subgraph nodes error:', nodesError)
          return NextResponse.json(
            { error: 'Failed to query nodes' },
            { status: 500 }
          )
        }

        const nodeIds = (nodesData || []).map((n) => n.id)

        for (const node of nodesData || []) {
          nodes.push({
            id: node.id,
            type: node.node_type,
            data: node.node_data || {},
          })
        }

        // Get edges between these nodes
        if (nodeIds.length > 0) {
          let edgesQuery = supabase
            .from('graph_edges')
            .select('id, source_node_id, target_node_id, edge_type, edge_data')
            .eq('user_id', userId)
            .in('source_node_id', nodeIds)

          if (input.edge_types && input.edge_types.length > 0) {
            edgesQuery = edgesQuery.in('edge_type', input.edge_types)
          }

          const { data: edgesData } = await edgesQuery.limit(input.limit * 2)

          for (const edge of edgesData || []) {
            edges.push({
              id: edge.id,
              source: edge.source_node_id,
              target: edge.target_node_id,
              type: edge.edge_type,
              data: edge.edge_data,
            })
          }
        }

        depthReached = 1
        break
      }

      case 'path': {
        // Find path between two nodes
        if (!input.start_node || !input.end_node) {
          return NextResponse.json(
            { error: 'start_node and end_node are required for path query' },
            { status: 400 }
          )
        }

        // BFS to find shortest path
        const visited = new Set<string>()
        const parent = new Map<string, { nodeId: string; edge: GraphEdge }>()

        const queue: string[] = [input.start_node]
        visited.add(input.start_node)

        let found = false
        while (queue.length > 0 && !found) {
          const current = queue.shift()!

          const { data: outEdges } = await supabase
            .from('graph_edges')
            .select('id, source_node_id, target_node_id, edge_type, edge_data')
            .eq('user_id', userId)
            .eq('source_node_id', current)

          for (const edge of outEdges || []) {
            const targetId = edge.target_node_id
            if (!visited.has(targetId)) {
              visited.add(targetId)
              parent.set(targetId, {
                nodeId: current,
                edge: {
                  id: edge.id,
                  source: edge.source_node_id,
                  target: edge.target_node_id,
                  type: edge.edge_type,
                  data: edge.edge_data,
                },
              })

              if (targetId === input.end_node) {
                found = true
                break
              }

              queue.push(targetId)
            }
          }
        }

        // Reconstruct path
        if (found) {
          const pathNodes: string[] = [input.end_node]
          const pathEdges: GraphEdge[] = []

          let current = input.end_node
          while (current !== input.start_node) {
            const p = parent.get(current)
            if (!p) break
            pathEdges.unshift(p.edge)
            pathNodes.unshift(p.nodeId)
            current = p.nodeId
          }

          // Get nodes data
          const { data: nodesData } = await supabase
            .from('graph_nodes')
            .select('id, node_type, node_data')
            .eq('user_id', userId)
            .in('id', pathNodes)

          for (const nodeId of pathNodes) {
            const nodeData = nodesData?.find((n) => n.id === nodeId)
            if (nodeData) {
              nodes.push({
                id: nodeData.id,
                type: nodeData.node_type,
                data: nodeData.node_data || {},
              })
            }
          }

          edges.push(...pathEdges)
          depthReached = pathEdges.length
        }
        break
      }
    }

    const response: GraphQueryResponse = {
      graph: graphResult.data,
      query_type: input.query_type,
      nodes,
      edges,
      stats: {
        nodes_found: nodes.length,
        edges_found: edges.length,
        depth_reached: depthReached,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Graph query error:', error)
    return NextResponse.json(
      { error: 'Graph query failed' },
      { status: 500 }
    )
  }
}