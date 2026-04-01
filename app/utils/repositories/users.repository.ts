import type { $Fetch } from 'nitropack'
import type { PaginatedResponse, ApiUser, ApiUserDetail } from '~/types/user'

enum API_USERS_URLs {
  LIST = '/admin/users',
  DETAIL = '/admin/users/{id}',
  SUBSCRIPTION = '/admin/users/{id}/subscription',
}

export interface UsersQueryParams {
  page: number
  limit: number
}

export function usersRepository(fetch: $Fetch) {
  async function list(params: UsersQueryParams): Promise<PaginatedResponse<ApiUser>> {
    return fetch<PaginatedResponse<ApiUser>>(API_USERS_URLs.LIST, {
      query: {
        page: params.page,
        limit: params.limit,
      },
    })
  }

  async function getById(userId: number): Promise<ApiUserDetail> {
    const url = API_USERS_URLs.DETAIL.replace('{id}', userId.toString())
    return fetch<ApiUserDetail>(url)
  }

  async function addSubscription(userId: number, additionalMonths: number) {
    const url = API_USERS_URLs.SUBSCRIPTION.replace('{id}', userId.toString())
    return fetch(url, {
      method: 'PUT',
      body: { additionalMonths },
    })
  }

  return { list, getById, addSubscription }
}
