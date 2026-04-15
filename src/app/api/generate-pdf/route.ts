/**
 * PDF 생성 API Route
 * 견적서 데이터를 받아 PDF Blob을 생성하여 반환
 */

import { NextRequest, NextResponse } from 'next/server'
import { createElement } from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { InvoicePDFDocument } from '@/components/pdf/InvoiceTemplate'
import type { Invoice } from '@/types/invoice'
import { ERROR_MESSAGES, PDF_CONFIG } from '@/lib/constants'
import { sanitizeFilename } from '@/lib/format'

/**
 * POST /api/generate-pdf
 * 견적서 데이터를 받아 PDF를 생성하여 반환
 */
export async function POST(req: NextRequest) {
  try {
    // 1단계: 요청 바디에서 invoice 데이터 추출
    const { invoice }: { invoice: Invoice } = await req.json()

    // 2단계: 데이터 검증
    if (!invoice || !invoice.invoiceNumber) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_INVOICE_DATA },
        { status: 400 }
      )
    }

    // 3단계: PDF Document 생성
    const pdfDoc = createElement(InvoicePDFDocument, { invoice })

    // 4단계: PDF Buffer 생성 (서버 환경 전용 named export API)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(pdfDoc as any)

    // 5단계: 파일명 생성
    const filename = `${PDF_CONFIG.FILENAME_PREFIX}-${sanitizeFilename(invoice.invoiceNumber)}.pdf`

    // 6단계: 응답 반환
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=0',
      },
    })
  } catch (error) {
    console.error(ERROR_MESSAGES.PDF_GENERATION_ERROR, error)
    return NextResponse.json(
      { error: ERROR_MESSAGES.PDF_GENERATION_ERROR },
      { status: 500 }
    )
  }
}
