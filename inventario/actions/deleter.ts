"use server";



import prisma from "@/lib/prisma";




export async function eliminarElemento(id: string, tipo: string) {
    // Eliminar un elemento de la base de datos

    console.log("Eliminar elemento", id, tipo);
    

    let res;
    if (tipo === "partes") {
        res = await prisma.partes.delete({
            where: {
                id: id,
            },
        });
    }
    else if (tipo === "motocicletas") {
        res = await prisma.motocicleta.delete({
            where: {
                id: id,
            },
        });
    }

    else if (tipo === "proveedores") {
        res = await prisma.proveedor.delete({
            where: {
                id: id,
            },
        });
    }

    else if (tipo === "servicios") {
        res = await prisma.servicio.delete({
            where: {
                id: id,
            },
        });
    }
    else if (tipo === "clientes") {
        res = await prisma.cliente.delete({
            where: {
                id: id,
            },
        });
    }
    else if (tipo === "reparaciones") {
        res = await prisma.reparacion.delete({
            where: {
                id: id,
            },
        });
    }
    else if (tipo === "reparacionPartes") {
        res = await prisma.reparacionPartes.delete({
            where: {
                id: id,
            },
        });
    }
    


    else {
        throw new Error("Tipo de elemento no valido");
    }

    return res;
}