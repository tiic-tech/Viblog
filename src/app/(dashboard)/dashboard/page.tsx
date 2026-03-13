import { createClient } from '@/lib/supabase/server'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentArticles } from '@/components/dashboard/recent-articles'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user's projects count
  const { count: projectsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  // Fetch user's articles count
  const { count: articlesCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  // Fetch recent articles
  const { data: recentArticles } = await supabase
    .from('articles')
    .select('id, title, slug, status, created_at, projects(name)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here is your vibe coding journey.</p>
      </div>

      <DashboardStats
        projectsCount={projectsCount || 0}
        articlesCount={articlesCount || 0}
      />

      <RecentArticles articles={recentArticles || []} />
    </div>
  )
}