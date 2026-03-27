import type { $Fetch } from 'nitropack'
import type { PaginatedResponse, ApiUser } from '~/types/user'

enum API_USERS_URLs {
  LIST = '/admin/users',
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

  return { list }
}
