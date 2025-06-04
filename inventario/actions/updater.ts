"use server";

import { editarCliente } from "./cliente/crud";
import { editarMoto } from "./motocicleta/crud";
import { editarParte } from "./partes/crud";
import { editarProveedor } from "./proveedores/crud";
import { editarReparacion } from "./reparacion/crud";
import { editarServicio } from "./servicios/crud";

export async function actualizarElemento(data: any, tipo: string) {
    let res;
    
    if (tipo === "motocicleta") {
        res = await editarMoto(data);
    }
    else if (tipo === "proveedor") {
        res = await editarProveedor(data);
    }
    else if (tipo === "parte") {
        res = await editarParte(data);
    }
    else if (tipo === "servicio") {
        res = await editarServicio(data);
    }
    else if (tipo === "cliente") {
        res = await editarCliente(data);
    }
    else if (tipo === "reparacion") {
        res = await editarReparacion(data);
    }
    else {
        throw new Error("Tipo de elemento no válido");
    }

    return res;
}