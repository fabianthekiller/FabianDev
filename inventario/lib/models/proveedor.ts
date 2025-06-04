import z from "zod";


export const proveedorSchemaCrear = z.object({
    nombre: z.string().describe("Nombre").min(1, { message: "El nombre es obligatorio" }),
    telefono: z.string().describe("Teléfono").optional(),
    direccion: z.string().describe("Dirección").optional(),
    email: z.string().describe("Email").optional(),
})

export const proveedorSchemaEditar = z.object({
    id: z.string().describe("ID del proveedor"),
    nombre: z.string().describe("Nombre").min(1, { message: "El nombre es obligatorio" }),
    telefono: z.string().describe("Teléfono").optional(),
    direccion: z.string().describe("Dirección").optional(),
    email: z.string().describe("Email").optional(),
})

