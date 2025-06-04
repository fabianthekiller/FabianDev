"use server";



import prisma from "@/lib/prisma";
import { crearParte } from "./partes/crud";
import { crearMoto } from "./motocicleta/crud";
import { crearProveedor } from "./proveedores/crud";
import { crearServicio } from "./servicios/crud";
import { crearCliente } from "./cliente/crud";
import { crearReparacion } from "./reparacion/crud";


export async function crearElemento(data: any, tipo: string) {

    // Crear un elemento en la base de datos
    
    console.log("Crear elemento", data, tipo);
    
    
    let res;
    if (tipo === "partes") {
        res = await crearParte(data);
    }
    else if (tipo === "motocicleta") {

        res = await crearMoto(data);
    }
    else if (tipo === "proveedor") {
        res = await crearProveedor(data);
    }
    else if (tipo === "servicio") {
        res = await crearServicio(data);
    }
    else if (tipo === "proveedores") {
        res = await crearProveedor(data);
    }
    else if (tipo === "clientes") {
        res = await crearCliente(data);
    }
    else if (tipo === "clienteAsignarMotocicleta") {
    }
    else if (tipo === "reparaciones") {
         res = await crearReparacion(data);
    }
    else {
        throw new Error("Tipo de elemento no valido");
    }

    return res;
}