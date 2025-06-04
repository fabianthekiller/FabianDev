"use server";



import prisma from "@/lib/prisma";
import { asignarMotocicletaCliente } from "./cliente/crud";

export async function asignarElemento(data: any, tipo: string) {
    let res;

    if (tipo === "clienteAsignarMotocicleta") {

        console.log("asignarElemento", data, tipo);


        delete data["cliente"];
        delete data["motocicleta"];
        delete data["extends"];

        res= await asignarMotocicletaCliente(data);
        
       
    }

    else if (tipo === "reparacionAsignarParte") {
        console.log("asignarElemento", data, tipo);

        delete data["reparacion"];
        delete data["parte"];
        delete data["extends"];

        res= await prisma.reparacionPartes.create({
            data: {
                ...data,
            }
        });
    }

    else {
        throw new Error("Tipo de elemento no valido");
    }



    return res;


}