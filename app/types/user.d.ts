export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'

export interface User {
  id: number
  name: string
  email: string
  avatar?: AvatarProps
  status: UserStatus
  documentsVerified: boolean
  newContents: boolean
  supporter: boolean
  location: string
}
