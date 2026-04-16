/**
 * 클라이언트 포털 레이아웃
 * Server Component (세션 검증)
 */

import { getClientSession } from '@/lib/auth/client-session'
import { redirect } from 'next/navigation'
import { ClientHeader } from '@/components/client/client-header'
import { ClientNav } from '@/components/client/client-nav'

/**
 * 클라이언트 레이아웃 Props
 */
interface ClientLayoutProps {
  children: React.ReactNode
}

/**
 * 클라이언트 포털 레이아웃
 * 인증된 클라이언트만 접근 가능 (미들웨어 이중 보안)
 */
export default async function ClientLayout({ children }: ClientLayoutProps) {
  const session = await getClientSession()

  // 세션이 없으면 로그인 페이지로 리다이렉트
  // (미들웨어에서도 체크하지만 이중 보안)
  if (!session) {
    redirect('/client/login')
  }

  return (
    <div className="bg-background min-h-screen">
      <ClientHeader />
      <div className="flex">
        {/* 클라이언트 정보를 nav에 전달 */}
        <ClientNav
          clientName={session.clientName}
          companyName={session.companyName}
        />
        <main className="bg-muted/20 flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
