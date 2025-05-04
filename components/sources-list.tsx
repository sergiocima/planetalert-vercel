import { Button } from "@/components/ui/button"
import { FileText, LinkIcon, Download, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Source } from "@/types/source"

export default function SourcesList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">Nessuna fonte disponibile</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sources.map((source) => (
        <div key={source.id} className="border rounded-md p-3">
          <div className="flex items-start gap-2">
            <div className="mt-0.5">
              {source.type === "article" ? (
                <FileText className="h-4 w-4 text-muted-foreground" />
              ) : source.type === "link" ? (
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Download className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{source.title}</h4>
              <p className="text-xs text-muted-foreground truncate">{source.author}</p>
            </div>
            {source.url && (
              <Link href={source.url} target="_blank" rel="noopener noreferrer">
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
