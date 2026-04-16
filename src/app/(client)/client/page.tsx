/**
 * 클라이언트 포털 대시보드 페이지
 * 세션에서 클라이언트 정보를 가져와 견적서 요약과 최근 목록을 표시
 * Server Component: 데이터 페칭을 서버에서 처리
 */

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getClientSession } from '@/lib/auth/client-session'
import { getInvoicesByClientId } from '@/lib/services/invoice.service'
import { InvoiceSummaryCards } from '@/components/client/invoice-summary-cards'
import { ClientInvoiceTable } from '@/components/client/client-invoice-table'
import { Button } from '@/components/ui/button'

/**
 * 최근 견적서로 표시할 최대 건수
 */
const RECENT_INVOICES_LIMIT = 5

/**
 * 클라이언트 대시보드 페이지
 * - 세션 없으면 로그인 페이지로 리다이렉트
 * - 요약 카드 + 최근 견적서 5건 표시
 */
export default async function ClientDashboardPage() {
  // 세션 조회 (없으면 로그인으로 리다이렉트)
  const session = await getClientSession()
  if (!session) {
    redirect('/client/login')
  }

  // 해당 클라이언트의 전체 견적서 조회 (발행일 내림차순)
  const invoices = await getInvoicesByClientId(session.clientId)

  // 최근 N건만 추출
  const recentInvoices = invoices.slice(0, RECENT_INVOICES_LIMIT)

  return (
    <div className="space-y-6">
      {/* 인사 헤더 섹션 */}
      <div>
        <h1 className="text-2xl font-bold">
          안녕하세요, {session.clientName}님
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {session.companyName && `${session.companyName} · `}
          발행된 견적서를 확인하세요
        </p>
      </div>

      {/* 견적서 요약 카드 4개 */}
      <InvoiceSummaryCards invoices={invoices} />

      {/* 최근 견적서 섹션 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">최근 견적서</h2>
          {/* 전체 건수가 제한 수를 초과할 때만 '전체 보기' 버튼 표시 */}
          {invoices.length > RECENT_INVOICES_LIMIT && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/client/invoices">전체 보기</Link>
            </Button>
          )}
        </div>
        <ClientInvoiceTable invoices={recentInvoices} />
      </div>
    </div>
  )
}
