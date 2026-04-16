/**
 * 클라이언트 포털 견적서 요약 카드 컴포넌트
 * 전체 견적서 수, 상태별 집계, 총 견적 금액을 4개의 카드로 시각화
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Clock, DollarSign, FileText } from 'lucide-react'
import type { Invoice } from '@/types/invoice'

/**
 * 견적서 요약 카드 Props
 */
interface InvoiceSummaryCardsProps {
  /** 견적서 배열 */
  invoices: Invoice[]
}

/**
 * 클라이언트 견적서 통계 요약 카드
 * 4개 카드: 전체 견적서 / 대기 중 / 확정 / 총 견적 금액
 */
export function InvoiceSummaryCards({ invoices }: InvoiceSummaryCardsProps) {
  // 대기 중(pending) 상태 건수
  const pendingCount = invoices.filter(inv => inv.status === 'pending').length

  // 확정(confirmed) 상태 건수
  const confirmedCount = invoices.filter(
    inv => inv.status === 'confirmed'
  ).length

  // 전체 견적 금액 합계
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 전체 견적서 카드 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">전체 견적서</CardTitle>
          <FileText className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{invoices.length}</div>
          <p className="text-muted-foreground mt-1 text-xs">
            발행된 견적서 총 건수
          </p>
        </CardContent>
      </Card>

      {/* 대기 중 카드 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">대기 중</CardTitle>
          <Clock className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingCount}</div>
          <p className="text-muted-foreground mt-1 text-xs">
            검토 대기 중인 견적서
          </p>
        </CardContent>
      </Card>

      {/* 확정 카드 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">확정</CardTitle>
          <CheckCircle className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{confirmedCount}</div>
          <p className="text-muted-foreground mt-1 text-xs">확정된 견적서</p>
        </CardContent>
      </Card>

      {/* 총 견적 금액 카드 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">총 견적 금액</CardTitle>
          <DollarSign className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          {/* 원화 포맷: 1,500,000 형식 */}
          <div className="text-2xl font-bold">
            ₩{totalAmount.toLocaleString('ko-KR')}
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            전체 견적 합산 금액
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
