/**
 * 클라이언트 포털 네비게이션 사이드바
 * Client Component (활성 링크 하이라이팅)
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, FileText, MessageCircle } from 'lucide-react'

/**
 * 클라이언트 네비게이션 Props
 */
interface ClientNavProps {
  /** 클라이언트 담당자 이름 (선택사항) */
  clientName?: string
  /** 회사명 (선택사항) */
  companyName?: string | null
}

/**
 * 네비게이션 항목 정의
 */
const navItems = [
  {
    href: '/client',
    label: '대시보드',
    icon: Home,
  },
  {
    href: '/client/invoices',
    label: '견적서 목록',
    icon: FileText,
  },
]

/**
 * 클라이언트 포털 네비게이션 사이드바
 * 너비 w-56 (관리자 w-64 대비 좁게)
 */
export function ClientNav({ clientName, companyName }: ClientNavProps) {
  const pathname = usePathname()

  return (
    <nav className="bg-muted/10 flex min-h-[calc(100vh-3.5rem)] w-56 flex-col border-r">
      {/* 클라이언트 프로필 요약 섹션 */}
      {clientName && (
        <div className="border-b px-4 py-4">
          <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            접속 계정
          </p>
          <p className="mt-1 truncate text-sm font-semibold">{clientName}</p>
          {companyName && (
            <p className="text-muted-foreground mt-0.5 truncate text-xs">
              {companyName}
            </p>
          )}
        </div>
      )}

      {/* 네비게이션 링크 목록 */}
      <div className="flex-1 p-3">
        <ul className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon
            // /client/invoices는 /client와 구분하여 정확히 매칭
            const isActive =
              item.href === '/client'
                ? pathname === '/client'
                : pathname.startsWith(item.href)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* 하단 문의 안내 텍스트 */}
      <div className="border-t px-4 py-4">
        <div className="flex items-start gap-2">
          <MessageCircle className="text-muted-foreground mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p className="text-muted-foreground text-xs leading-relaxed">
            견적서 관련 문의사항은 담당자에게 연락해 주세요.
          </p>
        </div>
      </div>
    </nav>
  )
}
