import { FolderKanban, FileText, PenLine } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardStatsProps {
  projectsCount: number
  articlesCount: number
}

export function DashboardStats({ projectsCount, articlesCount }: DashboardStatsProps) {
  const stats = [
    {
      title: 'Projects',
      value: projectsCount,
      icon: FolderKanban,
      description: 'Active projects',
    },
    {
      title: 'Articles',
      value: articlesCount,
      icon: FileText,
      description: 'Total articles',
    },
    {
      title: 'Quick Action',
      value: 0,
      icon: PenLine,
      description: 'Write new article',
      isAction: true,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stat.isAction ? (
              <a
                href="/dashboard/articles/new"
                className="text-sm text-primary hover:underline"
              >
                Create new article
              </a>
            ) : (
              <>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}