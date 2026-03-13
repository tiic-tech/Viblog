import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { FileX } from 'lucide-react'

export default function ArticleNotFound() {
  return (
    <div className="container py-16">
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6 text-center">
          <FileX className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">Article not found</h2>
          <p className="mb-4 text-muted-foreground">
            This article could not be found. It may have been removed or the link is incorrect.
          </p>
          <Link
            href="/"
            className="hover:bg-primary/80 inline-flex items-center justify-center rounded-lg bg-primary px-2.5 py-1.5 text-sm font-medium text-primary-foreground"
          >
            Browse articles
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}