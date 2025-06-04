"use server";
import { parteSchemaCrear, parteSchemaEditar } from "@/lib/models/parte";
import prisma from "@/lib/prisma";

//zod to json

import { zodToJsonSchema } from "zod-to-json-schema";


export async function obtenerTodasLasPartes() {
    // Obtener todas las parte de la base de datos
    const parte = await prisma.partes.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            proveedor: true,
        }
    });
    return parte;
}


export async function obtenerEsquemaParteCrear() {
    // Obtener una moto por su id
    const parteEsquema = parteSchemaCrear

    return zodToJsonSchema(parteEsquema, {
        $refStrategy: "none",
        target: "jsonSchema7",
    });

}

export async function obtenerEsquemaParteEditar() {
    // Obtener una moto por su id
    const parteEsquema = parteSchemaEditar

    return zodToJsonSchema(parteEsquema, {
        $refStrategy: "none",
        target: "jsonSchema7",
    });

}


export async function crearParte(data: any) {
    
    // Validar el esquema de la parte

    const dataGet= typeof data === 'string' ? JSON.parse(data) : data;

    delete dataGet.id;

    if (dataGet.proveedor) {
        dataGet.proveedorId= dataGet.proveedor.id;
        delete dataGet.proveedor;
    }



    const validacion = parteSchemaCrear.safeParse(dataGet);
    if (!validacion.success) {
        console.log("Error al validar el esquema de la parte", validacion.error);
        throw new Error("Error al validar el esquema de la parte");
    }
    // Validar el esquema de la parte
    
    // Crear una parte en la base de datos
    const parteCreada = await prisma.partes.create({
        //@ts-ignore
        data: validacion.data,
    });
    return parteCreada;
}

export async function eliminarParte(id: string) {
    // Eliminar una parte de la base de datos
    const parteEliminada = await prisma.partes.delete({
        where: {
            id: id,
        },
    });
    return parteEliminada;
}


export async function editarParte(data: any) {
    const dataGet = typeof data === 'string' ? JSON.parse(data) : data;

    if (!dataGet.id) {
        throw new Error("El id de la parte es requerido");
    }

    if (dataGet.proveedor) {
        dataGet.proveedorId = dataGet.proveedor.id;
        delete dataGet.proveedor;
    }

    const validacion = parteSchemaEditar.safeParse(dataGet);
    if (!validacion.success) {
        console.log("Error al validar el esquema de la parte", validacion.error);
        throw new Error("Error al validar el esquema de la parte");
    }

    const idParte = dataGet.id;
    delete dataGet.id;
    const parteActualizada = await prisma.partes.update({
        where: {
            id: idParte
        },
        data: dataGet
    });

    return parteActualizada;
}