/**
 * 클라이언트 포털 로그아웃 버튼 컴포넌트
 * Client Component (버튼 클릭 이벤트 처리)
 */

'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { logoutAction } from '@/app/(client)/client/actions'

/**
 * 클라이언트 로그아웃 버튼
 * form action으로 Server Action 직접 연결 (redirect 예외 catch 방지)
 */
export function ClientLogoutButton() {
  return (
    <form action={logoutAction}>
      <Button variant="ghost" size="sm" type="submit">
        <LogOut className="mr-2 h-4 w-4" />
        로그아웃
      </Button>
    </form>
  )
}
