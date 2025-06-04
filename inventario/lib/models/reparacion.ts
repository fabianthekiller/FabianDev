import z from "zod";

import { parteSchemaCrear, parteSchemaEditar } from "./parte";
import { servicioSchemaCrear, servicioSchemaEditar } from "./servicio";
import { clienteSchemaCrear, clienteSchemaEditar } from "./cliente";

export const reparacionSchemaCrear = z.object({
  fecha: z.string().describe("Fecha").optional(),
  nombre: z.string().describe("Nombre").optional(),
  descripcion: z.string().describe("Descripción").optional(),
  estado: z.enum(["PENDIENTE", "EN_PROCESO", "FINALIZADO"]).describe("Estado").optional(),
  clienteId: z.string().describe("ID del cliente").optional(),
  cliente: clienteSchemaCrear.describe("Cliente").optional(),
  precioTotal: z.number().describe("Precio total").min(0, { message: "El precio total es inválido" }),
         extends: z.object({
              ocultos: z.array(z.string()).optional().default(["clienteId","parteId","servicioId"]),
          }).describe("Extensiones").optional(),
});

export const reparacionSchemaEditar = z.object({
  id: z.string().describe("ID de la reparación"),
  fecha: z.string().describe("Fecha").optional(),
  nombre: z.string().describe("Nombre").optional(),
  descripcion: z.string().describe("Descripción").optional(),
  estado: z.enum(["PENDIENTE", "EN_PROCESO", "FINALIZADO"]).describe("Estado").optional(),
  clienteId: z.string().describe("ID del cliente").optional(),
  cliente: clienteSchemaCrear.describe("Cliente").optional(),
  ReparacionPartes: z.array(
    z.object({
      id: z.string().describe("ID de la parte"),
      parteId: z.string().describe("ID de la parte"),
      reparacionId: z.string().describe("ID de la reparación"),
      parte: parteSchemaCrear.describe("Parte").optional(),
    })
  ).optional().describe("Partes de la reparación"),
  precioTotal: z.number().describe("Precio total").min(0, { message: "El precio total es inválido" }),
  //mecanicoId: z.string().describe("ID del mecánico").optional(),
  mecanico: z.object({
    id: z.string().describe("ID del mecánico"),
    name: z.string().describe("Nombre del mecánico"),
    email: z.string().email().describe("Email del mecánico"),
  }).describe("Mecánico").optional(),
});
export const reparacionSchemaEliminar = z.object({
    id: z.string().describe("ID de la reparación"),
});



export const reparacionSchemaAsignarParte = z.object(
    {
        parteId: z.string().describe("ID de la parte"),
        reparacionId: z.string().describe("ID de la reparación"),
        parte: parteSchemaCrear.describe("Parte").optional(),
        cantidad: z.number().describe("Cantidad").min(1, { message: "La cantidad es inválida" }),
        extends: z.object({
            ocultos: z.array(z.string()).optional().default(["parteId","reparacionId"]),
        }
        ).describe('Extensiones').optional(),
    }
    )
