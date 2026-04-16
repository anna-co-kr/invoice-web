/**
 * 클라이언트 포털 전체 견적서 목록 페이지
 * 세션에서 클라이언트 정보를 가져와 해당 클라이언트의 모든 견적서를 표시
 * Server Component: 데이터 페칭을 서버에서 처리
 */

import { redirect } from 'next/navigation'
import { getClientSession } from '@/lib/auth/client-session'
import { getInvoicesByClientId } from '@/lib/services/invoice.service'
import { ClientInvoiceTable } from '@/components/client/client-invoice-table'

/**
 * 클라이언트 전체 견적서 목록 페이지
 * - 세션 없으면 로그인 페이지로 리다이렉트
 * - 전체 견적서 목록 표시 (발행일 내림차순)
 */
export default async function ClientInvoicesPage() {
  // 세션 조회 (없으면 로그인으로 리다이렉트)
  const session = await getClientSession()
  if (!session) {
    redirect('/client/login')
  }

  // 해당 클라이언트의 전체 견적서 조회 (발행일 내림차순)
  const invoices = await getInvoicesByClientId(session.clientId)

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold">견적서 목록</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          총 {invoices.length}개의 견적서
        </p>
      </div>

      {/* 전체 견적서 테이블 */}
      <ClientInvoiceTable invoices={invoices} />
    </div>
  )
}
