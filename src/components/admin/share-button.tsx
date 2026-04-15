'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Share2, Mail, MessageCircle, Copy } from 'lucide-react'
import { toast } from 'sonner'

interface ShareButtonProps {
  url: string
  title: string
  description?: string
}

/**
 * 링크 공유 버튼 컴포넌트 (Client Component)
 * Web Share API 지원 시 네이티브 공유 시트 사용,
 * 미지원 환경에서는 이메일/텔레그램/복사 드롭다운으로 fallback
 */
export function ShareButton({ url, title, description }: ShareButtonProps) {
  const shareText = description || '견적서를 확인해주세요'

  // Web Share API 지원 여부 확인 (모바일 Safari, Android Chrome 등)
  const canUseWebShare = typeof navigator !== 'undefined' && !!navigator.share

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: `견적서: ${title}`, text: shareText, url })
    } catch (error) {
      // 사용자가 공유를 취소한 경우 무시
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error('공유에 실패했습니다')
      }
    }
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`견적서: ${title}`)
    const body = encodeURIComponent(`${shareText}\n\n${url}`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const shareViaTelegram = () => {
    const text = encodeURIComponent(`${title}\n${url}`)
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('링크가 복사되었습니다')
    } catch {
      toast.error('복사에 실패했습니다')
    }
  }

  // 모바일 환경: 네이티브 공유 시트 사용
  if (canUseWebShare) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleNativeShare}
        aria-label="공유"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    )
  }

  // 데스크톱 환경: 드롭다운 메뉴
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="공유 옵션"
        >
          <Share2 className="h-4 w-4" />
          <span className="sr-only">공유</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={shareViaEmail}>
          <Mail className="mr-2 h-4 w-4" />
          이메일로 공유
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareViaTelegram}>
          <MessageCircle className="mr-2 h-4 w-4" />
          텔레그램으로 공유
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyLink}>
          <Copy className="mr-2 h-4 w-4" />
          링크 복사
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
