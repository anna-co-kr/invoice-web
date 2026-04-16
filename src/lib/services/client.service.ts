/**
 * 클라이언트 포털 서비스 레이어
 * Notion Clients 데이터베이스 조회 및 인증 처리
 */

import { notion } from '@/lib/notion'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'
import type { Client } from '@/types/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

/**
 * Clients 데이터베이스의 data_source_id 캐시
 * getDataSourceId()와 동일한 패턴으로 캐싱
 */
let cachedClientsDataSourceId: string | null = null

/**
 * Clients 데이터베이스의 data_source_id 조회 (캐싱 적용)
 * Notion API v5에서는 database_id 대신 data_source_id 사용
 */
async function getClientsDataSourceId(): Promise<string> {
  if (cachedClientsDataSourceId) {
    return cachedClientsDataSourceId
  }

  try {
    const response = await notion.databases.retrieve({
      database_id: env.NOTION_CLIENTS_DATABASE_ID,
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataSources = (response as any).data_sources

    if (!dataSources || dataSources.length === 0) {
      // v5 API data_sources 없는 경우 database_id 그대로 사용 (fallback)
      cachedClientsDataSourceId = env.NOTION_CLIENTS_DATABASE_ID
      return cachedClientsDataSourceId
    }

    cachedClientsDataSourceId = dataSources[0].id as string
    logger.info('Clients Data Source ID 캐싱 완료', {
      dataSourceId: cachedClientsDataSourceId,
    })

    return cachedClientsDataSourceId
  } catch (error) {
    logger.error('Clients Data Source ID 조회 실패', {
      databaseId: env.NOTION_CLIENTS_DATABASE_ID,
      error,
    })
    throw error
  }
}

/**
 * Notion 페이지에서 클라이언트 객체로 변환
 * @param page - Notion 페이지 응답 객체
 * @returns Client 객체 또는 null (변환 실패 시)
 */
function parseClientFromPage(page: PageObjectResponse): Client | null {
  try {
    const props = page.properties

    // client_id (title 타입)
    const clientIdProp = props['client_id']
    const clientId =
      clientIdProp?.type === 'title'
        ? (clientIdProp.title[0]?.plain_text ?? '')
        : ''

    // email (email 타입)
    const emailProp = props['email']
    const email = emailProp?.type === 'email' ? (emailProp.email ?? '') : ''

    // name (rich_text 타입)
    const nameProp = props['name']
    const name =
      nameProp?.type === 'rich_text'
        ? (nameProp.rich_text[0]?.plain_text ?? '')
        : ''

    // company (rich_text 타입, 선택사항)
    const companyProp = props['company']
    const company =
      companyProp?.type === 'rich_text'
        ? (companyProp.rich_text[0]?.plain_text ?? null)
        : null

    // is_active (checkbox 타입)
    const isActiveProp = props['is_active']
    const isActive =
      isActiveProp?.type === 'checkbox' ? isActiveProp.checkbox : false

    // invoices (relation 타입)
    const invoicesProp = props['invoices']
    const invoiceIds =
      invoicesProp?.type === 'relation'
        ? invoicesProp.relation.map(r => r.id)
        : []

    return {
      id: page.id,
      clientId,
      email,
      name,
      company: company || null,
      isActive,
      invoiceIds,
    }
  } catch (error) {
    logger.error('클라이언트 데이터 파싱 실패', { pageId: page.id, error })
    return null
  }
}

/**
 * 이메일과 접속 토큰으로 클라이언트 인증 조회
 * Notion Clients DB에서 이메일로 필터링 후 토큰 비교 및 활성화 여부 확인
 *
 * @param email - 클라이언트 이메일
 * @param token - 접속 토큰
 * @returns 일치하는 활성 클라이언트 또는 null
 */
export async function findClientByCredentials(
  email: string,
  token: string
): Promise<Client | null> {
  try {
    const dataSourceId = await getClientsDataSourceId()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.dataSources as any).query({
      data_source_id: dataSourceId,
      filter: {
        property: 'email',
        email: {
          equals: email,
        },
      },
    })

    if (!response.results || response.results.length === 0) {
      return null
    }

    // 첫 번째 일치 결과 처리
    const page = response.results[0] as PageObjectResponse

    if (!('properties' in page)) {
      return null
    }

    // access_token 필드 검증 (rich_text 타입)
    const accessTokenProp = page.properties['access_token']
    const storedToken =
      accessTokenProp?.type === 'rich_text'
        ? (accessTokenProp.rich_text[0]?.plain_text ?? '')
        : ''

    // 토큰이 일치하지 않으면 null 반환
    if (storedToken !== token) {
      return null
    }

    const client = parseClientFromPage(page)

    // 비활성 계정 거부
    if (!client || !client.isActive) {
      return null
    }

    return client
  } catch (error) {
    logger.error('클라이언트 자격증명 조회 실패', { email, error })
    return null
  }
}

/**
 * Notion 페이지 ID로 클라이언트 조회
 * JWT 세션 검증 후 클라이언트 정보를 최신화할 때 사용
 *
 * @param clientId - Notion 페이지 ID
 * @returns 클라이언트 객체 또는 null
 */
export async function getClientById(clientId: string): Promise<Client | null> {
  try {
    const response = await notion.pages.retrieve({ page_id: clientId })

    if (!('properties' in response)) {
      return null
    }

    const page = response as PageObjectResponse
    return parseClientFromPage(page)
  } catch (error) {
    logger.error('클라이언트 조회 실패', { clientId, error })
    return null
  }
}
