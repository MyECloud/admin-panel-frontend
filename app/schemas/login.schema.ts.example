import { boolean, object, string } from 'yup'
import { toTypedSchema } from '@vee-validate/yup'

export const loginSchema = toTypedSchema(object({
  emailOrUsername: string()
    .required('Inserisci un indirizzo email oppure un nome utente (no caratteri speciali)')
    .test('email-or-username', 'Inserisci un indirizzo email valido oppure un nome utente (no caratteri speciali)', (value) => {
      if (!value)
        return false

      // Check if it looks like an email
      const isEmail = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(value)

      if (isEmail) {
        // Validate as email: 5-100 characters
        return value.length >= 5 && value.length <= 100
      } else {
        // Validate as username: 5-15 characters, alphanumeric only
        const isValidUsername = /^[a-z0-9]+$/i.test(value)
        return isValidUsername && value.length >= 5 && value.length <= 15
      }
    }),
  password: string().required().min(8).max(64),
  remember: boolean(),
  token: string().required()
}))
