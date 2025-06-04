"use server";
import { auth } from "@/auth";
import { reparacionSchemaCrear,reparacionSchemaEditar,reparacionSchemaAsignarParte } from "@/lib/models/reparacion";
import prisma from "@/lib/prisma";
import moment from "moment";

//zod to json

import { zodToJsonSchema } from "zod-to-json-schema";

export async function obtenerTodasLasReparaciones() {
    // Obtener todas las reparaciones de la base de datos
    const reparacion = await prisma.reparacion.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            ReparacionPartes:{
                include: {
                    parte: true,
                }
            },
            cliente: true,
            mecanico: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            }
        }
    });
    return reparacion;
}
export async function obtenerEsquemaReparacionCrear() {
    // Obtener una moto por su id
    const reparacionEsquema = reparacionSchemaCrear

    return zodToJsonSchema(reparacionEsquema, {
        $refStrategy: "none",
        target: "jsonSchema7",
    });

}

export async function obtenerEsquemaReparacionEditar() {
    // Obtener una moto por su id
    const reparacionEsquema = reparacionSchemaEditar

    return zodToJsonSchema(reparacionEsquema, {
        $refStrategy: "none",
        target: "jsonSchema7",
    });

}

export async function obtenerEsquemaReparacionAsignarParte() {
    // Obtener una moto por su id
    const reparacionEsquema = reparacionSchemaAsignarParte

    return zodToJsonSchema(reparacionEsquema, {
        $refStrategy: "none",
        target: "jsonSchema7",
    });
}


export async function obtenerReparacionPorId(id: string) {
    // Obtener una reparacion por su id
    const reparacion = await prisma.reparacion.findUnique({
        where: {
            id: id,
        },
        include: {
            ReparacionPartes:true,
            cliente: true,
        }
    });
    return reparacion;
}

export async function crearReparacion(data: any) {
    
    // Validar el esquema de la reparacion

    const dataGet= typeof data === 'string' ? JSON.parse(data) : data;


    if (dataGet.fecha) {
        const fecha = moment(dataGet.fecha, "DD/MM/YYYY").toDate().toISOString();
        dataGet.fecha = fecha;
    }

    if (dataGet.cliente) {
        dataGet.clienteId= dataGet.cliente.id;
        delete dataGet.cliente;
    }

    //remove extends
    if (dataGet.extends) {
        delete dataGet.extends;
    }

    delete dataGet.id;

    if (dataGet.parte) {
        dataGet.parteId= dataGet.parte.id;
        delete dataGet.parte;
    }
    if (dataGet.servicio) {
        dataGet.servicioId= dataGet.servicio.id;
        delete dataGet.servicio;
    }

    const user= await auth();

    if (!user) {
        throw new Error("Usuario no autenticado");
    }
    const mecanico = await prisma.user.findUnique({
        where: {
            email: user.user?.email as string,
            is_mecanico: true,
        },
    });

    if (!mecanico) {
        throw new Error("Usuario no es un mecánico");
    }
    dataGet.mecanidoId = mecanico.id;

    const reparacion = await prisma.reparacion.create({
        data: {
            ...dataGet,
            mecanidoId: mecanico.id,

        }
    });
    return reparacion;
}

export async function obtenerReparacionesPorDocumentoCliente(documento: string) {
    // Obtener una reparacion por su documento
    const reparacion = await prisma.reparacion.findMany({
        where: {
            cliente: {
                documento: documento,
            }
        },
        include: {
            ReparacionPartes:true,
            cliente: true,
        }
    });
    return reparacion;
}


export async function editarReparacion(data: any) {
    const dataGet = typeof data === 'string' ? JSON.parse(data) : data;

    if (!dataGet.id) {
        throw new Error("El id de la reparación es requerido");
    }

    if (dataGet.fecha) {
        const fecha = moment(dataGet.fecha, "DD/MM/YYYY").toDate().toISOString();
        dataGet.fecha = fecha;
    }

    if (dataGet.cliente) {
        dataGet.clienteId = dataGet.cliente.id;
        delete dataGet.cliente;
    }

    if (dataGet.extends) {
        delete dataGet.extends;
    }


    const validacion = reparacionSchemaEditar.safeParse(dataGet);
    if (!validacion.success) {
        
        throw new Error("Error al validar el esquema de la reparación");
    }

    const idReparacion = dataGet.id;
    delete dataGet.id;
    delete dataGet.ReparacionPartes;
    delete dataGet.mecanico;
    delete dataGet.cliente;


    const reparacionActualizada = await prisma.reparacion.update({
        where: {
            id: idReparacion
        },
        data: dataGet
    });

    return reparacionActualizada;
}

