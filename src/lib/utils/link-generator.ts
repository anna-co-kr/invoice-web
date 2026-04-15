import { env } from '@/lib/env'

/**
 * 환경에 따른 베이스 URL 반환
 * 우선순위: NEXT_PUBLIC_BASE_URL(명시 설정) → VERCEL_URL → localhost
 */
function getBaseUrl(): string {
  const baseUrl = env.NEXT_PUBLIC_BASE_URL

  // localhost 기본값인 경우 Vercel 배포 URL로 대체
  if (baseUrl === 'http://localhost:3000' && env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}`
  }

  return baseUrl
}

/**
 * 견적서 고유 URL 생성
 * @param invoiceId - 견적서 ID
 * @returns 견적서 전체 URL
 */
export function generateInvoiceUrl(invoiceId: string): string {
  return `${getBaseUrl()}/invoice/${invoiceId}`
}

/**
 * 링크 표시용 짧은 경로 반환
 * @param invoiceId - 견적서 ID
 * @returns 표시용 경로 문자열
 */
export function generateShortUrl(invoiceId: string): string {
  const shortId = invoiceId.replace(/-/g, '').substring(0, 8)
  return `/invoice/${shortId}...`
}
