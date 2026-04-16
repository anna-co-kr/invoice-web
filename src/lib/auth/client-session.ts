/**
 * 클라이언트 포털 JWT 세션 관리 유틸리티
 * 관리자 세션(admin_session)과 완전히 분리된 클라이언트 전용 세션
 */

import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { env } from '@/lib/env'
import type { ClientSessionPayload } from '@/types/client'

/** 클라이언트 JWT 암호화 키 */
const SECRET = new TextEncoder().encode(env.CLIENT_JWT_SECRET)

/** 클라이언트 세션 쿠키 이름 (관리자 'admin_session'과 분리) */
const COOKIE_NAME = 'client_session'

/** 세션 만료 시간 (7일) */
const MAX_AGE = 7 * 24 * 60 * 60 // 604800초

/**
 * 새로운 클라이언트 세션 생성
 * JWT 토큰을 생성하고 httpOnly 쿠키에 저장
 * @param payload - JWT에 담을 클라이언트 세션 정보
 */
export async function createClientSession(
  payload: ClientSessionPayload
): Promise<void> {
  // JWT 토큰 생성 (JWTPayload 인덱스 시그니처 요구사항 충족을 위해 명시적 객체로 변환)
  const jwtPayload: Record<string, unknown> = {
    clientId: payload.clientId,
    email: payload.email,
    clientName: payload.clientName,
    companyName: payload.companyName,
    loginTime: payload.loginTime,
  }

  const token = await new SignJWT(jwtPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET)

  // httpOnly 쿠키에 저장
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true, // XSS 공격 방지
    secure: env.NODE_ENV === 'production', // 프로덕션에서만 HTTPS 전송
    sameSite: 'lax', // CSRF 공격 방지
    maxAge: MAX_AGE,
    path: '/',
  })
}

/**
 * 현재 클라이언트 세션 정보 조회
 * @returns 클라이언트 세션 페이로드 또는 null (세션이 없거나 만료된 경우)
 */
export async function getClientSession(): Promise<ClientSessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as ClientSessionPayload
  } catch {
    // JWT 검증 실패 (만료, 변조 등)
    return null
  }
}

/**
 * 클라이언트 세션 삭제 (로그아웃)
 */
export async function deleteClientSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
