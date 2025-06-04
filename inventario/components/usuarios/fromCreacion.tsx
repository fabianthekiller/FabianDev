"use client";

import { saltAndHashPassword } from "@/utils/password"
import { CrearUsuario } from "@/actions/usuarios/crud";
import {InputText} from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


export default function FormCrearUsuarioCMP() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMecanico, setIsMecanico] = useState(false);

    return (
        <div>
            <div className="card p-4 shadow-2 border-round w-full max-w-30rem">
                <h1 className="text-3xl font-bold text-center mb-4">Crear Usuario</h1>
                <form action={CrearUsuario} method="POST" className="flex flex-column gap-3">
                    <div className="flex flex-column gap-2">
                        <label htmlFor="email" className="font-semibold">Email</label>
                        <InputText type="email" name="email" id="email" required 
                            className="w-full" />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="password" className="font-semibold">Contraseña</label>
                        <InputText type="password" name="password" id="password" required 
                            className="w-full" />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="name" className="font-semibold">Nombre</label>
                        <InputText type="text" name="name" id="name" required 
                            className="w-full" />
                    </div>
                    <div className="flex align-items-center gap-2">
                        <Checkbox inputId="is_admin" name="is_admin" 
                            checked={isAdmin} 
                            onChange={e => setIsAdmin(e.checked ?? false)} />
                        <label htmlFor="is_admin" className="font-semibold">Es Admin</label>
                    </div>
                    <div className="flex align-items-center gap-2">
                        <Checkbox inputId="is_mecanico" name="is_mecanico" 
                            checked={isMecanico} 
                            onChange={e => setIsMecanico(e.checked ?? false)} />
                        <label htmlFor="is_mecanico" className="font-semibold">Es Mecanico</label>
                    </div>
                    <Button type="submit" 
                        label="Crear Usuario"
                        className="mt-3 w-full" 
                        
                        />
                </form>
            </div>
        </div>
    );
}
