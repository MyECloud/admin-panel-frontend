import type { $Fetch } from 'nitropack'
import type { PaginatedResponse, ApiUser } from '~/types/user'

enum API_USERS_URLs {
  LIST = '/admin/users',
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

  async function addSubscription(userId: number, additionalMonths: number) {
    const url = API_USERS_URLs.SUBSCRIPTION.replace('{id}', userId.toString())
    return fetch(url, {
      method: 'PUT',
      body: { additionalMonths },
    })
  }

  return { list, addSubscription }
}
