/**
 * 클라이언트 포털 데이터 격리 가드
 * 클라이언트가 자신의 견적서에만 접근할 수 있도록 검증
 */

import { getClientById } from '@/lib/services/client.service'
import { logger } from '@/lib/logger'

/**
 * 견적서가 해당 클라이언트 소유인지 검증
 * 클라이언트 A가 클라이언트 B의 견적서 URL에 직접 접근하는 것을 차단
 *
 * @param invoiceId - 조회하려는 견적서의 Notion 페이지 ID
 * @param clientId - 현재 세션의 클라이언트 Notion 페이지 ID
 * @returns 해당 클라이언트 소유 여부
 */
export async function checkInvoiceBelongsToClient(
  invoiceId: string,
  clientId: string
): Promise<boolean> {
  try {
    const client = await getClientById(clientId)

    if (!client) {
      logger.warn('클라이언트 가드: 클라이언트를 찾을 수 없음', { clientId })
      return false
    }

    const belongs = client.invoiceIds.includes(invoiceId)

    if (!belongs) {
      logger.warn('클라이언트 가드: 접근 거부 - 다른 클라이언트의 견적서', {
        clientId,
        invoiceId,
        clientInvoiceCount: client.invoiceIds.length,
      })
    }

    return belongs
  } catch (error) {
    logger.error('클라이언트 가드: 검증 중 오류 발생', {
      clientId,
      invoiceId,
      error,
    })
    return false
  }
}

/**
 * 견적서 소유권 검증 후 미소유 시 에러를 throw
 * Server Component에서 notFound() 또는 redirect()와 함께 사용
 *
 * @param invoiceId - 조회하려는 견적서의 Notion 페이지 ID
 * @param clientId - 현재 세션의 클라이언트 Notion 페이지 ID
 * @throws Error - 해당 클라이언트 소유가 아닌 경우
 */
export async function assertInvoiceBelongsToClient(
  invoiceId: string,
  clientId: string
): Promise<void> {
  const belongs = await checkInvoiceBelongsToClient(invoiceId, clientId)

  if (!belongs) {
    throw new Error('이 견적서에 접근할 권한이 없습니다.')
  }
}
