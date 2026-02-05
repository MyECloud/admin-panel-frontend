import type { AsyncData, AsyncDataOptions, UseFetchOptions } from 'nuxt/app'
import type { FetchError } from 'ofetch'

export type APIReturnType<T, E = undefined> = ReturnType<typeof useAPI<T, E>>
export type UseAPIType = typeof useAPI

export function useAPI<T, E>(
  url: string | (() => string),
  options?: UseFetchOptions<T>
) {
  return useFetch<T, FetchError<E>>(url, {
    ...(options || {}),
    $fetch: useNuxtApp().$api
  })
}

export function useAsyncAPI<T, E>(
  key: string,
  func: () => Promise<T>,
  options?: AsyncDataOptions<T>
) {
  return useAsyncData<T, E>(
    key,
    () => func(),
    {
      getCachedData(key, nuxt) {
        return nuxt.payload.data[key] || nuxt.static.data[key]
        // return nuxt.isHydrating ? nuxt.payload.data[key] : nuxt.static.data[key]
      },
      dedupe: 'defer',
      ...options
    }
  ) as AsyncData<T, E>
}
