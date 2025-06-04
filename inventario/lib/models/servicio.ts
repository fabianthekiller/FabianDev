import z from "zod";

export const servicioSchemaCrear = z.object({
  nombre: z.string().describe("Nombre").min(1, { message: "El nombre es obligatorio" }),
  descripcion: z.string().describe("Descripción").optional(),
  precio: z.number().describe("Precio").min(0, { message: "El precio es inválido" }),
  tiempoEstimado: z.string().describe("Tiempo estimado").optional(),
});

export const servicioSchemaEditar = z.object({
  id: z.string().describe("ID del servicio"),
  nombre: z.string().describe("Nombre").min(1, { message: "El nombre es obligatorio" }),
  descripcion: z.string().describe("Descripción").optional(),
  precio: z.number().describe("Precio").min(0, { message: "El precio es inválido" }),
  tiempoEstimado: z.string().describe("Tiempo estimado").optional(),
});
