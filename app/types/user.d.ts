export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'

// Document Status type
export type DocumentsStatus
  = | 'not_sent'
    | 'pending'
    | 'verified'

export interface UserPremium {
  isActive: boolean
  expiration: string | null
}

export type ApiUserType = 'escort' | 'user'

export interface ApiUser {
  id: number
  name: string
  username: string
  isActive: boolean
  avatarUrl: string | null
  premium: UserPremium
  type: ApiUserType
  supporter: boolean | null
  newContents: boolean
}

export interface User {
  id: number
  username: string
  email: string
  avatar?: AvatarProps
  status: UserStatus
  type: 'utente' | 'signorina'
  documentsVerified: boolean // lo lasciamo per compatibilità
  documentsStatus: DocumentsStatus
  newContents: boolean
  supporter: boolean
  location: string

  premiumActive: boolean
  premiumHistory: boolean
  hasDonated: boolean

  profileCode: string
}

export interface PaginatedMeta {
  totalItems: number
  itemCount: number
  itemsPerPage: number
  totalPages: number
  currentPage: number
}

export interface PaginatedLinks {
  first: string
  previous: string
  next: string
  last: string
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: PaginatedMeta
  links: PaginatedLinks
  totalResults: number
}
