export interface Review {
  id: number
  reporter: {
    id: number
    username: string
    avatarUrl: string
    name: string
  }
  reason: string
  date: Date
  freeTextReason: string
}

export interface ApiReview {
  id: number
  reporter: {
    id: number
    username: string
    avatarUrl: string
  }

  review: {
    creationDate: Date
    title: string
  }
  reason: string
  date: Date
  freeTextReason: string
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: PaginatedMeta
  links: PaginatedLinks
  totalResults: number
}

export interface reviewsReport {
  id: number

  reporter: {
    id: number
    username: string
    name: string
    avatarUrl?: string
  }

  reported: {
    id: number
    username: string
    name: string
    avatarUrl?: string
  }

  reason: string
  freeTextReason?: string
  date: string
}
