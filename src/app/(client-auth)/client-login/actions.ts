/**
 * 클라이언트 포털 로그인 Server Actions
 * 관리자 로그인(admin-login/actions.ts)과 완전히 분리된 클라이언트 전용 인증
 */

'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { findClientByCredentials } from '@/lib/services/client.service'
import { createClientSession } from '@/lib/auth/client-session'
import type { ClientLoginResult } from '@/types/client'

/**
 * 클라이언트 로그인 폼 유효성 검증 스키마
 * 이메일 형식 + 최소 1자 이상의 접속 토큰
 */
const loginSchema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
})

/**
 * 클라이언트 포털 로그인 Server Action
 * useActionState와 호환되는 (prevState, formData) 시그니처
 *
 * @param _prevState - 이전 상태 (useActionState 호환용, 미사용)
 * @param formData - 폼 데이터 (email, token 필드 포함)
 * @returns 로그인 성공/실패 결과
 */
export async function loginAction(
  _prevState: ClientLoginResult,
  formData: FormData
): Promise<ClientLoginResult> {
  // FormData에서 필드값 추출
  const rawData = {
    email: formData.get('email'),
    token: formData.get('token'),
  }

  // Zod 유효성 검증
  const validationResult = loginSchema.safeParse(rawData)

  if (!validationResult.success) {
    return {
      success: false,
      message: '이메일 또는 토큰 형식이 올바르지 않습니다.',
    }
  }

  const { email, token } = validationResult.data

  try {
    // Notion Clients DB에서 이메일 + 접속 토큰으로 클라이언트 조회
    const client = await findClientByCredentials(email, token)

    // 일치하는 클라이언트가 없거나 비활성 계정인 경우
    if (!client) {
      return {
        success: false,
        message: '이메일 또는 접속 토큰이 올바르지 않습니다.',
      }
    }

    // 클라이언트 세션 생성 (client_session 쿠키, 관리자 admin_session과 분리)
    await createClientSession({
      clientId: client.id,
      email: client.email,
      clientName: client.name,
      companyName: client.company,
      loginTime: Date.now(),
    })
  } catch {
    // Notion API 호출 실패 등 예기치 않은 오류
    return {
      success: false,
      message: '로그인 중 오류가 발생했습니다.',
    }
  }

  // 세션 생성 성공 후 클라이언트 포털 홈으로 이동
  // redirect()는 try/catch 밖에서 호출해야 정상 동작 (내부적으로 NEXT_REDIRECT 예외 사용)
  redirect('/client')
}
