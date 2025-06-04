import z from "zod";
import { proveedorSchemaCrear, proveedorSchemaEditar } from "./proveedor";

export const parteSchemaCrear = z.object({
  nombre: z.string().describe("Nombre").min(1, { message: "El nombre es obligatorio" }),
  descripcion: z.string().describe("Descripción").optional(),
  imagen: z.string().describe("Imagen").optional(),
  precio: z.number().describe("Precio").min(0, { message: "El precio es inválido" }),
  cantidad: z.number().describe("Cantidad").min(0, { message: "La cantidad es inválida" }),
  proveedor: proveedorSchemaCrear.describe("Proveedor").optional(),
  proveedorId: z.string().describe("ID del proveedor").optional(),

});

export const parteSchemaEditar = z.object({
    id: z.string().describe("ID de la parte"),
    nombre: z.string().describe("Nombre").min(1, { message: "El nombre es obligatorio" }),
    descripcion: z.string().describe("Descripción").optional(),
    imagen: z.string().describe("Imagen").optional(),
    precio: z.number().describe("Precio").min(0, { message: "El precio es inválido" }),
    cantidad: z.number().describe("Cantidad").min(0, { message: "La cantidad es inválida" }),
    proveedor: proveedorSchemaEditar.describe("Proveedor").optional(),
    proveedorId: z.string().describe("ID del proveedor").optional(),
});