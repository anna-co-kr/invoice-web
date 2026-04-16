/**
 * 클라이언트 포털 헤더 컴포넌트
 * Server Component - 세션 정보를 서버에서 직접 조회
 */

import { getClientSession } from '@/lib/auth/client-session'
import { ThemeToggle } from '@/components/theme-toggle'
import { ClientLogoutButton } from './client-logout-button'
import { Badge } from '@/components/ui/badge'
import { FileText } from 'lucide-react'

/**
 * 클라이언트 포털 헤더
 * 로고, 클라이언트 정보, 테마 토글, 로그아웃 버튼 포함
 */
export async function ClientHeader() {
  // 서버에서 세션 정보 조회
  const session = await getClientSession()

  return (
    <header className="bg-card/80 border-border/40 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-6">
        {/* 좌측: 로고 + 타이틀 */}
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 rounded-lg p-2">
            <FileText className="text-primary h-4 w-4" />
          </div>
          <h1 className="text-lg font-semibold">견적서 포털</h1>
        </div>

        {/* 우측: 클라이언트 정보 + 테마 토글 + 로그아웃 */}
        <div className="flex items-center gap-3">
          {/* 세션이 있는 경우 클라이언트 이름과 회사명 표시 */}
          {session && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{session.clientName}</span>
              {session.companyName && (
                <Badge variant="secondary" className="text-xs">
                  {session.companyName}
                </Badge>
              )}
            </div>
          )}
          <ThemeToggle />
          <ClientLogoutButton />
        </div>
      </div>
    </header>
  )
}
