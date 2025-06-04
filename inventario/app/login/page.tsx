"use client";
import { providerMap } from "@/auth"
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Password } from 'primereact/password'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import Image from "next/image"
import { useEffect, useState } from "react"
// Import both themes
// Import themes from public directory
import '/public/themes/lara-light-indigo/theme.css'
import '/public/themes/viva-dark/theme.css'


import { handleCredentialsLogin, handleProviderLogin } from './actions'

export default function SignInPage(props: {
    searchParams: { callbackUrl: string | undefined }
}) {
    const callbackUrl = props.searchParams.callbackUrl || '/'
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(prefersDark);
        document.body.classList.toggle('dark-theme', prefersDark);
    }, []);
    return (
        <div
            className="flex flex-column align-items-center justify-content-center min-h-screen relative"
            style={{
                backgroundImage: 'url("/loginbg.webp")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div 
                className="absolute top-0 left-0 w-full h-full"
                style={{
                    backgroundColor: 'rgba(0,0,0,0.4)'
                }}
            />
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-2 z-1 flex align-items-center flex-column">
                <div className="flex justify-content-center">
                    <Image  
                        src="/logo.png"
                        alt="Logo"
                        width={100}
                        height={100}
                        className="mb-3"
                    />
                </div>
                {JSON.stringify(isDark)}
                <h2 className="text-center mb-4">Conectarse a Rosal Motos</h2>
                <form
                    className="flex flex-column gap-3"
                    action={(formData) => handleCredentialsLogin(formData, callbackUrl)}
                >
                    <div className="flex flex-column gap-2">
                        <label htmlFor="email" className="font-bold">Correo electrónico</label>
                        <InputText
                            id="email"
                            name="email"
                            type="email"
                            className="w-full"
                        />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="password" className="font-bold">Contraseña</label>
                        <Password
                            id="password"
                            name="password"
                            className="w-full"
                            toggleMask
                            feedback={false}
                        />
                    </div>
                    <Button
                        type="submit"
                        label="Conectarse"
                        className="w-full"
                    />
                </form>

                <div className="flex flex-column gap-2 mt-4">
                    {Object.values(providerMap).map((provider) => (
                        <form
                            key={provider.id}
                            action={() => handleProviderLogin(provider.id)}
                        >
                            <Button
                                type="submit"
                                className="w-full"
                                severity="secondary"
                            >
                                <i className={`pi pi-${provider.name.toLowerCase()} mr-2`}></i>
                                <span>Sign in with {provider.name}</span>
                            </Button>
                        </form>
                    ))}
                </div>
            </div>
        </div>
    )
}