/**
 * 클라이언트 포털 로그인 페이지
 * Server Component (세션 확인 후 리다이렉트)
 */

import { getClientSession } from '@/lib/auth/client-session'
import { redirect } from 'next/navigation'
import { ClientLoginForm } from '@/components/client/client-login-form'
import { FileText } from 'lucide-react'
import type { Metadata } from 'next'

/** 페이지 메타데이터 */
export const metadata: Metadata = {
  title: '로그인 | 견적서 포털',
  description: '견적서 포털에 로그인하세요',
}

/**
 * 클라이언트 포털 로그인 페이지
 * 좌우 분할 레이아웃 (좌: 브랜딩 패널, 우: 로그인 폼)
 */
export default async function ClientLoginPage() {
  // 이미 로그인된 경우 클라이언트 포털 홈으로 리다이렉트
  const session = await getClientSession()
  if (session) {
    redirect('/client')
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-12">
      {/* 브랜딩 패널 - 모바일에서는 숨김 */}
      <div className="from-primary to-primary/80 hidden bg-gradient-to-br lg:col-span-5 lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="text-primary-foreground space-y-6 text-center">
          {/* 아이콘 */}
          <div className="bg-primary-foreground/10 mx-auto w-fit rounded-2xl p-4">
            <FileText className="h-12 w-12" />
          </div>

          {/* 타이틀 */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">견적서 포털</h1>
            <p className="text-primary-foreground/80 text-base">
              발행된 견적서를 한 곳에서 편리하게 확인하세요
            </p>
          </div>

          {/* 기능 안내 목록 */}
          <ul className="text-primary-foreground/70 mt-6 space-y-2 text-sm">
            <li className="flex items-center justify-center gap-2">
              <span className="bg-primary-foreground/20 h-1.5 w-1.5 rounded-full" />
              발행된 견적서 조회
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="bg-primary-foreground/20 h-1.5 w-1.5 rounded-full" />
              PDF 다운로드
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="bg-primary-foreground/20 h-1.5 w-1.5 rounded-full" />
              견적서 이력 관리
            </li>
          </ul>
        </div>
      </div>

      {/* 폼 영역 */}
      <div className="flex items-center justify-center p-8 lg:col-span-7">
        <div className="w-full max-w-md space-y-8">
          {/* 모바일 전용 로고 (브랜딩 패널이 숨겨질 때 표시) */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="bg-primary/10 rounded-lg p-2">
              <FileText className="text-primary h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">견적서 포털</span>
          </div>

          {/* 페이지 설명 */}
          <div>
            <h2 className="text-2xl font-semibold">로그인</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              이메일과 접속 토큰을 입력해주세요
            </p>
          </div>

          {/* 로그인 폼 */}
          <ClientLoginForm />
        </div>
      </div>
    </div>
  )
}
