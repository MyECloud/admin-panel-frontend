import type { $Fetch } from 'nitropack'
import type { AuthTokenResponseDto } from '~/model/api/auth/auth-token.dto'
import type { EmailExistsResponseDto } from '~/model/api/auth/email-exists.dto'
import type { MobilePhoneExistsResponseDto } from '~/model/api/auth/mobile-exists.dto'
import type { SignupRequestDto } from '~/model/api/auth/signup.dto'
import type { UsernameExistsResponseDto } from '~/model/api/auth/username-exists.dto'

enum API_AUTH_URLs {
    EMAIL_EXISTS = '/users/email/exists',
    USERNAME_EXISTS = '/users/username/exists',
    MOBILE_PHONE_EXISTS = '/users/phone/exists',
    PASSWORD_RECOVERY = '/auth/password/recovery',
    EMAIl_CONFIRMATION_EMAIL = '/auth/confirmationEmail',
    EMAIL_CONFIRMATION = '/auth/confirmationEmail/confirm',
    SIGNUP = '/auth/signup',
}

export function authRepository(fetch: $Fetch) {
    async function signup(data: SignupRequestDto): Promise<AuthTokenResponseDto> {
        return fetch<AuthTokenResponseDto>(API_AUTH_URLs.SIGNUP, {
            method: 'POST',
            body: data,
        })
    }

    async function emailExists(email: string): Promise<boolean> {
        return fetch<EmailExistsResponseDto>(API_AUTH_URLs.EMAIL_EXISTS, {
            query: {
                email,
            },
        }).then(({ result }) => result)
    }

    async function usernameExists(username: string): Promise<boolean> {
        return fetch<UsernameExistsResponseDto>(API_AUTH_URLs.USERNAME_EXISTS, {
            query: {
                username,
            },
        }).then(({ result }) => result)
    }

    async function mobilePhoneExists(phone: string): Promise<boolean> {
        return fetch<MobilePhoneExistsResponseDto>(API_AUTH_URLs.MOBILE_PHONE_EXISTS, {
            query: {
                phone,
            },
        }).then(({ result }) => result)
    }

    async function recoverPassword(email: string, token: string): Promise<void> {
        return fetch<void>(API_AUTH_URLs.PASSWORD_RECOVERY, {
            body: {
                email,
                captchaToken: token,
            },
        })
    }

    async function resendEmailConfirmationEmail(): Promise<void> {
        return fetch<void>(API_AUTH_URLs.EMAIl_CONFIRMATION_EMAIL, {
            method: 'POST',
        })
    }

    async function confirmEmail(token: string): Promise<void> {
        return fetch<void>(API_AUTH_URLs.EMAIL_CONFIRMATION, {
            method: 'POST',
            body: {
                token,
            },
        })
    }

    return { signup, emailExists, usernameExists, mobilePhoneExists, recoverPassword, resendEmailConfirmationEmail, confirmEmail }
}
