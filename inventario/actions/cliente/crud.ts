"use server";

import { clienteSchemaAsignarMotocicleta, clienteSchemaCrear, clienteSchemaEditar } from "@/lib/models/cliente";
import prisma from "@/lib/prisma";
import { zodToJsonSchema } from "zod-to-json-schema";


export async function obtenerTodosLosClientes() {
    // Obtener todos los clientes de la base de datos
    const cliente = await prisma.cliente.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            ClienteMotocicleta:{
                include: {
                    motocicleta: true,
                }
            }
        }
    });
    return cliente;
}

export async function obtenerEsquemaClienteCrear() {
    // Obtener una moto por su id
    const clienteEsquema = clienteSchemaCrear

    return zodToJsonSchema(clienteEsquema, {
        $refStrategy: "none",
        target: "jsonSchema7",
    });

}
export async function obtenerEsquemaClienteEditar() {
    // Obtener una moto por su id
    const clienteEsquema = clienteSchemaEditar

    return zodToJsonSchema(clienteEsquema, {
        $refStrategy: "none",
        target: "jsonSchema7",
    });

}


export async function obtenerEsquemaClienteAsignarMotocicleta() {
    // Obtener una moto por su id
    const clienteEsquema = clienteSchemaAsignarMotocicleta
    return zodToJsonSchema(clienteEsquema, {
        $refStrategy: "none",
        target: "jsonSchema7",
    });
}

export async function obtenerClientePorId(id: string) {
    // Obtener una moto por su id
    const cliente = await prisma.cliente.findUnique({
        where: {
            id: id,
        },
        include: {
            ClienteMotocicleta: true,
        }
    });
    return cliente;
}

export async function asignarMotocicletaCliente(data: any) {
    // Validar el esquema del cliente
    const dataGet= typeof data === 'string' ? JSON.parse(data) : data;
    const cliente = await prisma.clienteMotocicleta.create({
        data: {
            ...dataGet,
        }
    });

    return cliente;
}

export async function crearCliente(data: any) {
    // Validar el esquema del cliente

    const dataGet= typeof data === 'string' ? JSON.parse(data) : data;

    delete dataGet.id;

    if (dataGet.motocicleta) {
        dataGet.motocicletaId= dataGet.motocicleta.id;
        delete dataGet.motocicleta;
    }

    const cliente = await prisma.cliente.create({
        data: {
            ...dataGet,
        }
    });

    return cliente;
}


export async function obtenerClientePorDocumento(documento: string) {
    // Obtener un cliente por su documento
    const cliente = await prisma.cliente.findFirst({
        where: {
            documento: documento,
        },
        include: {
            ClienteMotocicleta: true,
        }
    });
    return cliente;
}


export async function editarCliente(data: any) {
    const dataGet = typeof data === 'string' ? JSON.parse(data) : data;

    if (!dataGet.id) {
        throw new Error("El id del cliente es requerido");
    }

    const validacion = clienteSchemaEditar.safeParse(dataGet);
    if (!validacion.success) {
        
        throw new Error("Error al validar el esquema del cliente");
    }

    const idCliente = dataGet.id;
    delete dataGet.id;
    delete dataGet.ClienteMotocicleta

    const clienteActualizado = await prisma.cliente.update({
        where: {
            id: idCliente
        },
        data: dataGet
    });

    return clienteActualizado;
}