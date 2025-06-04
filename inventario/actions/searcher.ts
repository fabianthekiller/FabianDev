"use server";



import prisma from "@/lib/prisma";
import { buscarProveedorPorNombre } from "./proveedores/crud";


export async function buscarElemento(consulta: any, tipo: string) {

    let res;

    if (tipo === "proveedor") {
        // sanitizar la consulta para mongo, prevenir inyecciones
        const consultaSanitizada = consulta.replace(/[^a-zA-Z0-9]/g, "");

        res = await buscarProveedorPorNombre(consultaSanitizada);

    }
    else if (tipo === "motocicleta") {
        // sanitizar la consulta para mongo, prevenir inyecciones
        const consultaSanitizada = consulta.replace(/[^a-zA-Z0-9]/g, "");

        res = await prisma.motocicleta.findMany({
            where: {
                modelo: {
                    contains: consultaSanitizada,
                    mode: 'insensitive',
                },
            }
        });

    }
    else if (tipo === "parte") {
        // sanitizar la consulta para mongo, prevenir inyecciones
        const consultaSanitizada = consulta.replace(/[^a-zA-Z0-9]/g, "");
        
        res = await prisma.partes.findMany({
            where: {
                nombre: {
                    contains: consultaSanitizada,
                    mode: 'insensitive',
                },
            }
        });

    }
    else if (tipo === "reparacion") {
        // sanitizar la consulta para mongo, prevenir inyecciones
        const consultaSanitizada = consulta.replace(/[^a-zA-Z0-9]/g, "");

        res = await prisma.reparacion.findMany({
            where: {
                cliente: {
                    OR: [
                        {
                            nombre: {
                                contains: consultaSanitizada,
                                mode: 'insensitive',
                            },
                        },
                        {
                            documento: {
                                contains: consultaSanitizada,
                                mode: 'insensitive',
                            },
                        },
                    ],
                },
            }
        });

    }
    else if (tipo === "servicio") {
        // sanitizar
        // sanitizar la consulta para mongo, prevenir inyecciones
        const consultaSanitizada = consulta.replace(/[^a-zA-Z0-9]/g, "");
        res = await prisma.servicio.findMany({
            where: {
                nombre: {
                    contains: consultaSanitizada,
                    mode: 'insensitive',
                },
            }
        });
    }
    else if (tipo === "cliente") {
        // sanitizar
        // sanitizar la consulta para mongo, prevenir inyecciones
        const consultaSanitizada = consulta.replace(/[^a-zA-Z0-9]/g, "");
        res = await prisma.cliente.findMany({
            where: {
            OR: [
                {
                nombre: {
                    contains: consultaSanitizada,
                    mode: 'insensitive',
                },
                },
                {
                documento: {
                    contains: consultaSanitizada,
                    mode: 'insensitive',
                },
                },
            ],
            },
        });
    }
    else {
        throw new Error("Tipo de elemento no valido");
    }

    return res;



}
