/**
 * 클라이언트 포털 타입 정의
 */

/**
 * Notion Clients 데이터베이스에서 조회된 클라이언트 모델
 */
export interface Client {
  /** Notion 페이지 ID */
  id: string
  /** 클라이언트 식별 ID (Title 필드값) */
  clientId: string
  /** 로그인에 사용되는 이메일 */
  email: string
  /** 클라이언트 담당자 이름 */
  name: string
  /** 회사명 (선택사항) */
  company: string | null
  /** 계정 활성화 여부 */
  isActive: boolean
  /** 연결된 견적서 Notion 페이지 ID 목록 */
  invoiceIds: string[]
}

/**
 * 클라이언트 JWT 세션 페이로드
 * JWT 토큰에 인코딩되는 클라이언트 정보
 */
export interface ClientSessionPayload {
  /** Notion 페이지 ID (고유 식별자) */
  clientId: string
  /** 클라이언트 이메일 */
  email: string
  /** 클라이언트 담당자 이름 */
  clientName: string
  /** 회사명 (선택사항) */
  companyName: string | null
  /** 로그인 시간 (Unix timestamp) */
  loginTime: number
}

/**
 * 클라이언트 로그인 폼 입력값
 */
export interface ClientLoginInput {
  /** 이메일 주소 */
  email: string
  /** 접속 토큰 */
  token: string
}

/**
 * 클라이언트 로그인 Server Action 반환 타입
 */
export interface ClientLoginResult {
  /** 로그인 성공 여부 */
  success: boolean
  /** 성공/실패 메시지 */
  message: string
}
