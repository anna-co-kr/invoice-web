/**
 * 클라이언트 포털 견적서 목록 테이블 컴포넌트
 * 견적서 번호 클릭 시 상세 페이지로 이동, 상태는 Badge로 표시
 */

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { INVOICE_STATUS_LABELS } from '@/lib/constants'
import type { Invoice, InvoiceStatus } from '@/types/invoice'
import type { VariantProps } from 'class-variance-authority'
import type { badgeVariants } from '@/components/ui/badge'

/**
 * 클라이언트 견적서 테이블 Props
 */
interface ClientInvoiceTableProps {
  /** 표시할 견적서 배열 */
  invoices: Invoice[]
}

/**
 * 상태별 Badge variant 매핑
 * pending: secondary / shared: default / confirmed: outline(green 별도 클래스) / cancelled: destructive
 */
type BadgeVariant = VariantProps<typeof badgeVariants>['variant']

const STATUS_BADGE_VARIANT: Record<InvoiceStatus, BadgeVariant> = {
  pending: 'secondary',
  shared: 'default',
  confirmed: 'outline',
  cancelled: 'destructive',
}

/**
 * ISO 날짜 문자열을 'YYYY.MM.DD' 형식으로 변환
 * @param dateStr - ISO 8601 형식 날짜 문자열 (예: '2025-01-15')
 * @returns 'YYYY.MM.DD' 형식 문자열 (예: '2025.01.15')
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  // ISO 날짜를 점(.) 구분자로 변환
  const [year, month, day] = dateStr.split('T')[0].split('-')
  return `${year}.${month}.${day}`
}

/**
 * 클라이언트 포털 전용 견적서 목록 테이블
 * 반응형: 모바일에서 가로 스크롤 지원
 */
export function ClientInvoiceTable({ invoices }: ClientInvoiceTableProps) {
  // 빈 목록 처리
  if (invoices.length === 0) {
    return (
      <div className="rounded-lg border">
        <div className="text-muted-foreground flex flex-col items-center justify-center py-16 text-sm">
          <p>조회된 견적서가 없습니다</p>
        </div>
      </div>
    )
  }

  return (
    /* 모바일 가로 스크롤을 위한 래퍼 */
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">견적서 번호</TableHead>
              <TableHead className="min-w-[100px]">발행일</TableHead>
              <TableHead className="min-w-[100px]">유효기간</TableHead>
              <TableHead className="min-w-[120px] text-right">
                총 금액
              </TableHead>
              <TableHead className="min-w-[80px] text-center">상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map(invoice => (
              <TableRow key={invoice.id}>
                {/* 견적서 번호: 상세 페이지로 이동 링크 */}
                <TableCell className="font-medium">
                  <Link
                    href={`/invoice/${invoice.id}`}
                    className="text-primary hover:underline"
                  >
                    {invoice.invoiceNumber}
                  </Link>
                </TableCell>

                {/* 발행일: YYYY.MM.DD 포맷 */}
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(invoice.issueDate)}
                </TableCell>

                {/* 유효기간: YYYY.MM.DD 포맷 */}
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(invoice.validUntil)}
                </TableCell>

                {/* 총 금액: 원화 포맷 */}
                <TableCell className="text-right text-sm font-medium">
                  ₩{invoice.totalAmount.toLocaleString('ko-KR')}
                </TableCell>

                {/* 상태 Badge */}
                <TableCell className="text-center">
                  <Badge
                    variant={STATUS_BADGE_VARIANT[invoice.status]}
                    className={
                      // confirmed 상태는 outline variant에 green 색상 추가
                      invoice.status === 'confirmed'
                        ? 'border-green-600 text-green-700 dark:border-green-500 dark:text-green-400'
                        : undefined
                    }
                  >
                    {INVOICE_STATUS_LABELS[invoice.status]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
