import z from 'zod';


export const motocicletaSchemaEditar = z.object(
    {
    id: z.string().describe('ID de la motocicleta'),
    marca: z.string().describe('Marca').min(1, { message: 'La marca es obligatoria' }),
    modelo: z.string().describe('Modelo'    ) .min(1, { message: 'El modelo es obligatorio' }),
    anio: z.number().describe('Año').min(1900, { message: 'El año es inválido' }).max(new Date().getFullYear(), { message: 'El año es inválido' }),
    descripcion: z.string().describe('Descripción').optional(),
    imagen: z.string().describe('Imagen').optional(),
  
});


export const motocicletaSchemaCrear = z.object(
    {
        marca: z.string().describe('Marca').min(1, { message: 'La marca es obligatoria' }),
        modelo: z.string().describe('Modelo'    ) .min(1, { message: 'El modelo es obligatorio' }),
        anio: z.number().describe('Año').min(1900, { message: 'El año es inválido' }).max(new Date().getFullYear(), { message: 'El año es inválido' }),
        descripcion: z.string().describe('Descripción').optional(),
        imagen: z.string().describe('Imagen').optional(),
  
    }
);


