"use server";

import prisma from "@/lib/prisma";
import { comparePassword } from "./password";

export async function getUserFromDb(email: string, passwordin: string) {
    const res =  await prisma.user.findFirst({
        where: {
            email: email,
        }
    });

    //compare password with hashed password bycrypt

    if (res && res.password) {
        const isMatch = await comparePassword(passwordin, res.password);
        if (!isMatch) {
            throw new Error("Contraseña incorrecta");
        }
    }
    
    
    
    if (!res) {

        throw new Error("Usuario no encontrado");
    }
    // return all except password
    const { password, ...user } = res;
    return user;
}