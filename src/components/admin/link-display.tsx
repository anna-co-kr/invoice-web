import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LinkDisplayProps {
  url: string
  className?: string
}

/**
 * URL에서 경로 부분만 추출하여 짧게 표시
 * 예: https://example.com/invoice/abc123 → /invoice/abc123...
 */
function getDisplayPath(url: string): string {
  try {
    const { pathname } = new URL(url)
    // 경로가 길면 앞 20자만 표시
    return pathname.length > 20 ? `${pathname.substring(0, 20)}...` : pathname
  } catch {
    return url.length > 30 ? `${url.substring(0, 27)}...` : url
  }
}

/**
 * 견적서 링크 표시 컴포넌트 (Server Component)
 * 경로 부분만 간결하게 표시하고 새 탭으로 열기
 */
export function LinkDisplay({ url, className }: LinkDisplayProps) {
  const displayPath = getDisplayPath(url)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`견적서 링크: ${url}`}
      className={cn(
        'text-muted-foreground hover:text-foreground text-sm',
        'flex items-center gap-1 transition-colors',
        className
      )}
    >
      <span className="hidden max-w-[160px] truncate sm:inline">
        {displayPath}
      </span>
      <ExternalLink className="h-3 w-3 flex-shrink-0" />
    </a>
  )
}
