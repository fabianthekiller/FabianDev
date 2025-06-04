"use server";

import { auth } from "@/auth";
import { servicioSchemaCrear, servicioSchemaEditar } from "@/lib/models/servicio";
import prisma from "@/lib/prisma";


//zod to json

import { zodToJsonSchema } from "zod-to-json-schema";


export async function obtenerTodosLosServicios() {
    // Obtener todos los servicios de la base de datos
    const servicios = await prisma.servicio.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
    return servicios;
}

export async function obtenerEsquemaServicioCrear() {
    // Obtener un servicio por su id
    const servicioEsquema = servicioSchemaCrear

    return zodToJsonSchema(servicioEsquema, {
        $refStrategy: "none",
        target: "jsonSchema7",
    });

}

export async function obtenerEsquemaServicioEditar() {
    // Obtener un servicio por su id
    const servicioEsquema = servicioSchemaEditar

    return zodToJsonSchema(servicioEsquema, {
        $refStrategy: "none",
        target: "jsonSchema7",
    });

}

export async function crearServicio(data: any) {

    // Validar el esquema del servicio

    const dataGet = typeof data === 'string' ? JSON.parse(data) : data;

    delete dataGet.id;

    const validacion = servicioSchemaCrear.safeParse(data);
    if (!validacion.success) {
        console.log("Error al validar el esquema del servicio", validacion.error);
        throw new Error("Error al validar el esquema del servicio");
    }
    // Validar el esquema del servicio

    // Crear un servicio en la base de datos



    const servicioCreado = await prisma.servicio.create({
        data: {
            ...dataGet,
        }        
    });

    return servicioCreado;
}
