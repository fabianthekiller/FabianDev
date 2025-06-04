"use server";
import { proveedorSchemaCrear, proveedorSchemaEditar } from "@/lib/models/proveedor";
import prisma from "@/lib/prisma";

//zod to json

import { zodToJsonSchema } from "zod-to-json-schema";

export async function obtenerTodosLosProveedores() {
    // Obtener todos los proveedores de la base de datos
    const proveedores = await prisma.proveedor.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
    return proveedores;
}

export async function obtenerEsquemaProveedorCrear() {
    // Obtener un proveedor por su id
    const proveedorEsquema = proveedorSchemaCrear

    return zodToJsonSchema(proveedorEsquema, {
        $refStrategy: "none",
        target: "jsonSchema7",
    });

}

export async function obtenerEsquemaProveedorEditar() {
    // Obtener un proveedor por su id
    const proveedorEsquema = proveedorSchemaEditar

    return zodToJsonSchema(proveedorEsquema, {
        $refStrategy: "none",
        target: "jsonSchema7",
    });

}

export async function crearProveedor(data: any) {
    
    // Validar el esquema del proveedor

    const dataGet= typeof data === 'string' ? JSON.parse(data) : data;

    delete dataGet.id;

    const validacion = proveedorSchemaCrear.safeParse(data);
    if (!validacion.success) {
        
        throw new Error("Error al validar el esquema del proveedor");
    }
    // Validar el esquema del proveedor
    
    // Crear un proveedor en la base de datos
    const proveedorCreado = await prisma.proveedor.create({
        data: dataGet,
    });

    return proveedorCreado;
}


export async function buscarProveedorPorNombre(nombre: string) {
    // Buscar un proveedor por su nombre
    const proveedor = await prisma.proveedor.findMany({
        where: {
            nombre: {
                contains: nombre,
                mode: 'insensitive',
            },
        },
        select: {
            id: true,
            nombre: true,
        }
    });
    return proveedor;
}

export async function editarProveedor(data: any) {
    const dataGet = typeof data === 'string' ? JSON.parse(data) : data;

    if (!dataGet.id) {
        throw new Error("El id del proveedor es requerido");
    }

    const validacion = proveedorSchemaEditar.safeParse(dataGet);
    if (!validacion.success) {
        
        throw new Error("Error al validar el esquema del proveedor");
    }

    const idProveedor = dataGet.id;
    delete dataGet.id;
    const proveedorActualizado = await prisma.proveedor.update({
        where: {
            id: idProveedor
        },
        data: dataGet
    });

    return proveedorActualizado;
}