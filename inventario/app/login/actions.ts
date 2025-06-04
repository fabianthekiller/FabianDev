'use server'

import { signIn } from "@/auth"
import { redirect } from "next/navigation"
import { AuthError } from "next-auth"

const SIGNIN_ERROR_URL = "/error"

export async function handleCredentialsLogin(formData: FormData, callbackUrl: string) {
    try {
        const result = await signIn("credentials", {
            ...Object.fromEntries(formData),
            redirect: false,
        })

        if (result?.error) {
            return redirect(`${SIGNIN_ERROR_URL}?error=${result.error}`)
        }

        return redirect(callbackUrl)
    } catch (error) {
        if (error instanceof AuthError) {
            return redirect(`${SIGNIN_ERROR_URL}?error=${error.message}`)
        }
        throw error
    }
}

export async function handleProviderLogin(providerId: string) {
    try {
        await signIn(providerId)
    } catch (error) {
        if (error instanceof AuthError) {
            return redirect(`${SIGNIN_ERROR_URL}?error=${error.message}`)
        }
        throw error
    }
}