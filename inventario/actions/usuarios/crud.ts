"use server";
import prisma from "@/lib/prisma";
import { saltAndHashPassword } from "@/utils/password";


export async function getUsersfromDb() {
    const res = await prisma.user.findMany({
        where: {
            isActive: true,
        },
        select: {
            password: false, // Exclude password from the result
            id: true,
            name: true,
            email: true,
            _count: true,
            createdAt: true,
            updatedAt: true,
            isActive: true,
            is_admin: true,
            is_mecanico: true,
            image: true,
        }
    })
    return res;
}



export async function CrearUsuario(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const is_admin = formData.get("is_admin") === "on" ? true : false;
    const is_mecanico = formData.get("is_mecanico") === "on" ? true : false;

    // check if user exists
    const userExists = await prisma.user.findFirst({
        where: {
            email: email,
        },
    });

    if (userExists) {
        throw new Error("El usuario ya existe");
    }

    // hash password
    const hashedPassword = await saltAndHashPassword(password);

    // create user
    const res = await prisma.user.create({
        data: {
            email: email,
            password: hashedPassword,
            name: name,
            is_admin: is_admin,
            is_mecanico: is_mecanico,
        },
    });
}

export async function is_admin(email: string) {
    const res = await prisma.user.findFirst({
        where: {
            email: email,
        },
    });
    if (res) {
        return res.is_admin;
    }
    return false;
}
