"use server";
import {motocicletaSchemaCrear,motocicletaSchemaEditar } from "@/lib/models/motocicleta";
import prisma from "@/lib/prisma";

//zod to json

import { zodToJsonSchema } from "zod-to-json-schema";


export async function obtenerTodasLasMotos() {
    // Obtener todas las motos de la base de datos
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

    const dataGet= typeof data === 'string' ? JSON.parse(data) : data;

    delete dataGet.id;
    // anio obtener el año actual

    const anioNuevo= new Date(dataGet.anio).getFullYear();
    dataGet.anio= anioNuevo;

    const validacion = motocicletaSchemaCrear.safeParse(dataGet);
    if (!validacion.success) {
        console.log("Error al validar el esquema de la moto", validacion.error);
        throw new Error("Error al validar el esquema de la moto");
    }
    // Validar el esquema de la moto
    
    // Crear una moto en la base de datos
    const motoCreada = await prisma.motocicleta.create({
        data: dataGet,
    });

    return motoCreada;
}