/**
 * 클라이언트 포털 Server Actions
 * 로그아웃 처리 전용
 */

'use server'

import { deleteClientSession } from '@/lib/auth/client-session'
import { redirect } from 'next/navigation'

/**
 * 클라이언트 로그아웃 Server Action
 * 세션 쿠키를 삭제하고 로그인 페이지로 리다이렉트
 */
export async function logoutAction(): Promise<void> {
  await deleteClientSession()
  redirect('/client-login')
}
