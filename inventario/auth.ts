import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client";
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { getUserFromDb } from "@/utils/db"
import type { Provider } from "next-auth/providers"
import { redirect } from "next/navigation";




const providers: Provider[] = [
    Credentials({
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        credentials: {
            email: {
                label: "Correo electrónico",
                type: "mail",
                placeholder: "Correo electrónico",
            },
            password: {
                label: "Contraseña",
                type: "password",
                placeholder: "Contraseña",
            },

            // custom button


        },
        


        authorize: async (credentials) => {
            const { email, password } = credentials as { email: string; password: string };
            if (!credentials?.email || !credentials?.password) {
                throw new Error("Missing credentials.");
            }

            // logic to verify if the user exists
            const user = await getUserFromDb(credentials.email as string, credentials.password as string);

            if (!user) {
                throw new Error("Invalid credentials.");
            }

            // return user object with their profile data
            return {
                id: user?.id,
                name: user?.name,
                email: user?.email,
                is_admin: user?.is_admin,
            };
        },
    },


),
]

export const providerMap = providers
    .map((provider) => {
        if (typeof provider === "function") {
            const providerData = provider()
            return { id: providerData.id, name: providerData.name }
        } else {
            return { id: provider.id, name: provider.name }
        }
    })
    .filter((provider) => provider.id !== "credentials")




const prisma = new PrismaClient();
export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt",
        
        //dos horas
        maxAge: 2* 60 * 60, // 24 hours
        updateAge: 24 * 60 * 60, // 24 hours
        generateSessionToken: () => {
            return crypto.randomUUID();
        }
    


     },
    //session time 
    theme: {
        colorScheme: "light", // "auto" | "dark" | "light"
        brandColor: "#5A67D8", // Hex color code
        logo: "/logo.png", // Absolute URL to image

        //size: "large", // "small" | "normal" | "large"
    },
    trustHost: true,
    providers,
    pages: {
        signIn: "/login",
    }


})
