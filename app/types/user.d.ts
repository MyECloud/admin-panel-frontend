export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'

// Document Status type
export type DocumentsStatus
  = | 'not_sent'
    | 'pending'
    | 'verified'

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
