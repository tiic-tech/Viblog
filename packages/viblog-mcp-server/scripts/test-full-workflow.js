/**
 * Full MCP Workflow Test
 *
 * Tests the complete article publishing workflow through MCP tools:
 * 1. create_vibe_session
 * 2. upload_session_context
 * 3. publish_article
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
const API_URL = process.env.VIBLOG_API_URL || 'https://viblog.tiic.tech';
const API_KEY = process.env.VIBLOG_API_KEY;
if (!API_KEY) {
    console.error('Error: VIBLOG_API_KEY environment variable is required');
    process.exit(1);
}
// Article content to publish
const ARTICLE_CONTENT = `# Viblog Ecosystem: Transform Vibe Coding into Valuable Knowledge

> **Original Discussion Date:** 2026-03-20
> **Session Platform:** Claude Code
> **Purpose:** Origin story for Viblog's About page

---

## The Question

As Co-Founder and CMO, I was asked to critically evaluate Viblog's ecosystem positioning:

> Claude Code records vibe coding internally. OpenClaw saves it locally. Viblog shares it with everyone. Does this positioning hold up?

This is the analysis.

---

## The Problem with "Sharing"

The initial positioning has a fundamental flaw: **sharing is not a pain point, it's a solution.**

The real pain points vibe coders experience:

| Pain Point | What Users Actually Feel |
|------------|-------------------------|
| Time loss | "I spent hours debugging, next time I'll repeat the same mistakes" |
| Influence | "I want to build tech credibility, but writing blogs takes too long" |
| Discovery | "I want to learn from others, but can't find quality content" |

"Share with everyone" assumes users want to share. But most developers default to **not sharing**.

### Why Developers Don't Share

\`\`\`
"My code is messy, I don't want people to see it"
"This is my competitive advantage, why would I share?"
"Writing blogs takes time I could spend coding"
"What if no one reads what I share?"
\`\`\`

Sharing requires motivation that most developers don't have by default.

---

## The Competitive Landscape Problem

Claude Code already captures sessions. Why would users switch to Viblog?

\`\`\`
Scenario A: Claude Code User
└── "I already have session recording, what does Viblog add?"
└── "You want me to switch tools? What's the benefit?"

Scenario B: Non-Claude Code User
└── "You only support Claude Code? I use Cursor/Copilot"
└── "MCP protocol? Too complex, don't understand"
\`\`\`

The positioning doesn't clearly differentiate from Claude Code's existing session recording.

---

## A Better Positioning

The concept can be saved, but needs reframing:

### From "Sharing" to "Assetization"

\`\`\`
Wrong: Share → Everyone
Right: Experience → Searchable, reusable, valuable knowledge asset
\`\`\`

The core value isn't sharing—it's **making experience produce value**.

### The Three Transformations

| Old | New | Why It Matters |
|-----|-----|----------------|
| "Share" | "Assetize" | Users get value, not just give it |
| "Everyone" | "Those who need it" | Precise matching, not broadcast |
| "Process" | "Experience" | Extracted insights, not raw data |

### The Corrected Positioning

> **Viblog: Transform Vibe Coding into Valuable Knowledge**

This says what users get, not just what Viblog does.

---

## The Ecosystem Layer Model

Rather than competing with Claude Code, Viblog can become the **output layer**:

\`\`\`
┌─────────────────────────────────────────────────────┐
│  Claude Code = Input Layer (capture vibe coding)    │
│  OpenClaw = Storage Layer (local, data sovereignty) │
│  Viblog = Output Layer (process into value)         │
└─────────────────────────────────────────────────────┘
\`\`\`

This positioning:
- Doesn't replace, but **enhances**
- Doesn't compete, but occupies a distinct **ecosystem niche**

### The Critical Question

Why wouldn't Claude Code build their own output layer?

**Answer:** Community network effects.

\`\`\`
Single-user value: Record, organize, AI-assisted writing
Multi-user value: Discover similar problems, learn from others, build influence
\`\`\`

Without community network effects, Claude Code can copy Viblog.
With community network effects, Viblog has a defensible position.

---

## Strategic Recommendations

### Short-term (Validation Phase)

- Don't sell "sharing" as the core value
- Validate "AI auto-writing" as the hook
- Target: Vibe coders who already write blogs (they have sharing motivation)

### Medium-term (Differentiation)

- Build "high-quality vibe coding content library"
- Make "Published on Viblog" a symbol of tech influence
- Analogy: Medium for blogging → Viblog for vibe coding

### Long-term (Moat)

- Community network effects
- Become the "knowledge search engine" for vibe coding
- AI recommendation: "Someone encountered this problem—you solved it 6 months ago"

---

## The New Origin Story

For Viblog's About page:

> **Viblog exists because vibe coding creates knowledge that deserves to last.**
>
> Claude Code captures your sessions. OpenClaw keeps your data. Viblog transforms your experience into searchable, reusable, valuable knowledge assets.
>
> We believe every debugging session, every architectural decision, every "aha" moment has value—not just for you, but for developers who will face the same problems tomorrow.
>
> **Viblog: Transform Vibe Coding into Valuable Knowledge.**

---

## Conclusion

The original positioning—"share with everyone"—describes a feature difference, not a value difference. It assumes users want to share without solving "why share."

The corrected positioning—"transform vibe coding into valuable knowledge"—speaks to what users get, not just what Viblog does.

This is the foundation Viblog should build upon.

---

*This article originated from a strategic discussion between the founder and Claude (as Co-Founder + CMO role). It serves as the origin story for Viblog's brand positioning.*

---

**Published via:** Claude Code + Viblog MCP Service
**Article Type:** Strategic Analysis
**Tags:** positioning, strategy, ecosystem, brand`;
async function main() {
    console.log('=== Viblog MCP Full Workflow Test ===\n');
    // Create client transport that spawns the MCP server
    const transport = new StdioClientTransport({
        command: 'node',
        args: ['dist/index.js'],
        env: {
            ...process.env,
            VIBLOG_API_URL: API_URL,
            VIBLOG_API_KEY: API_KEY,
        },
        stderr: 'pipe',
    });
    const client = new Client({ name: 'viblog-test-client', version: '1.0.0' }, { capabilities: {} });
    try {
        // Connect to server (this spawns the process)
        console.log('Connecting to MCP server...');
        await client.connect(transport);
        console.log('Connected!\n');
        // Log server stderr
        const stderr = transport.stderr;
        if (stderr) {
            stderr.on('data', (data) => {
                console.error('[Server stderr]', data.toString());
            });
        }
        // List available tools
        const toolsResult = await client.listTools();
        console.log('Available MCP Tools:');
        for (const tool of toolsResult.tools) {
            console.log(`  - ${tool.name}`);
        }
        console.log();
        // Step 1: Create vibe session
        console.log('--- Step 1: Creating vibe session ---');
        const sessionResult = await client.callTool({
            name: 'create_vibe_session',
            arguments: {
                title: 'Viblog Ecosystem Positioning Discussion',
                platform: 'claude-code',
                model: 'glm-5',
            },
        });
        const sessionData = JSON.parse(sessionResult.content[0].text);
        console.log('Session created:', sessionData.session_id);
        // Step 2: Upload session context
        console.log('\n--- Step 2: Uploading session context ---');
        const uploadResult = await client.callTool({
            name: 'upload_session_context',
            arguments: {
                session_id: sessionData.session_id,
                fragments: [
                    {
                        fragment_type: 'system_message',
                        content: ARTICLE_CONTENT,
                        sequence_number: 1,
                    },
                    {
                        fragment_type: 'user_prompt',
                        content: 'User asked: "Claude Code captures internally. OpenClaw saves locally. Viblog shares with everyone. Does this positioning hold up?"',
                        sequence_number: 2,
                    },
                ],
            },
        });
        const uploadData = JSON.parse(uploadResult.content[0].text);
        console.log('Uploaded fragments:', uploadData.count);
        // Step 3: Publish article
        console.log('\n--- Step 3: Publishing article (visibility: private) ---');
        const publishResult = await client.callTool({
            name: 'publish_article',
            arguments: {
                session_id: sessionData.session_id,
                title: 'Viblog Ecosystem: Transform Vibe Coding into Valuable Knowledge',
                content: ARTICLE_CONTENT,
                excerpt: 'A critical analysis of Viblog ecosystem positioning and strategic recommendations for brand development.',
                visibility: 'private',
            },
        });
        const publishData = JSON.parse(publishResult.content[0].text);
        console.log('\n=== Article Published! ===');
        console.log('Article ID:', publishData.article.id);
        console.log('Title:', publishData.article.title);
        console.log('Slug:', publishData.article.slug);
        console.log('Visibility:', publishData.article.visibility);
        console.log('URL:', publishData.article.url);
        console.log('\n=== Test Complete ===');
        console.log('Please visit', publishData.article.url, 'to verify the article.');
    }
    catch (error) {
        console.error('Error:', error);
        throw error;
    }
    finally {
        await client.close();
    }
}
main().catch((err) => {
    console.error('Test failed:', err);
    process.exit(1);
});
