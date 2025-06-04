



"use server";
import { motocicletaSchemaCrear, motocicletaSchemaEditar } from "@/lib/models/motocicleta";
import prisma from "@/lib/prisma";
import { zodToJsonSchema } from "zod-to-json-schema";


export async function obtenerTodasLasMotos() {
    const motos = await prisma.motocicleta.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
    return motos;
}

export async function obtenerEsquemaMoto() {
    // Obtener una moto por su id
    const motoEsquema = motocicletaSchemaEditar

    return zodToJsonSchema(motoEsquema, {
        $refStrategy: "none",
        target: "jsonSchema7",
    });

}

export async function crearMoto(data: any) {

    // Validar el esquema de la moto

    const dataGet = typeof data === 'string' ? JSON.parse(data) : data;

    delete dataGet.id;
    // anio obtener el año actual

    const anioNuevo = new Date(dataGet.anio).getFullYear();
    dataGet.anio = anioNuevo;

    const validacion = motocicletaSchemaCrear.safeParse(dataGet);
    if (!validacion.success) {
        
        throw new Error("Error al validar el esquema de la moto");
    }
    // Validar el esquema de la moto

    // Crear una moto en la base de datos
    const motoCreada = await prisma.motocicleta.create({
        data: dataGet,
    });

    return motoCreada;
}

export async function obtenerMotoPorId(id: string) {
    if (!id) {
        throw new Error("El id de la moto es requerido");
    }

    const moto = await prisma.motocicleta.findUnique({
        where: {
            id: id
        }
    });

    if (!moto) {
        throw new Error("No se encontró la moto");
    }

    return moto;
}


export async function editarMoto(data: any) {
    const dataGet = typeof data === 'string' ? JSON.parse(data) : data;

    if (!dataGet.id) {
        throw new Error("El id de la moto es requerido");
    }

    const anioNuevo = new Date(dataGet.anio).getFullYear();
    dataGet.anio = anioNuevo;

    const validacion = motocicletaSchemaEditar.safeParse(dataGet);
    if (!validacion.success) {
        
        throw new Error("Error al validar el esquema de la moto");
    }

    const idMoto = dataGet.id;
    delete dataGet.id;
    const motoActualizada = await prisma.motocicleta.update({
        where: {
            id: idMoto
        },
        data: dataGet
    });

    return motoActualizada;
}

export async function eliminarMoto(id: string) {
    if (!id) {
        throw new Error("El id de la moto es requerido");
    }

    const motoEliminada = await prisma.motocicleta.delete({
        where: {
            id: id
        }
    });

    return motoEliminada;
}

export async function buscarMotos(query: string) {
    const motos = await prisma.motocicleta.findMany({
        where: {
            OR: [
                {
                    modelo: {
                        contains: query,
                        mode: 'insensitive'
                    }
                },
                {
                    marca: {
                        contains: query,
                        mode: 'insensitive'
                    }
                }
            ]
        },
        take: 5
    });

    return motos;
}
