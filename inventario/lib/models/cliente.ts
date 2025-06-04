import z from 'zod';
import { motocicletaSchemaCrear } from './motocicleta';

export const clienteSchemaEditar = z.object(
    {
        id: z.string().uuid().describe('ID del cliente'),
        nombre: z.string().describe('Nombre').min(1, { message: 'El nombre es obligatorio' }),
        documento: z.string().describe('Documento').optional(),
        telefono: z.string().describe('Teléfono').optional(),
        email: z.string().describe("Correo electrónico").email({ message: 'El email es inválido' }).optional(),
        direccion: z.string().describe('Dirección').optional(),
        ClienteMotocicleta: z.array(
            z.object({
                id: z.string().uuid().describe('ID de la motocicleta'),
                motocicletaId: z.string().uuid().describe('ID de la motocicleta'),
                clienteId: z.string().uuid().describe('ID del cliente'),
                placa: z.string().describe('Placa de la motocicleta'),
            })
        ).optional().describe('Motocicletas del cliente'),


    }
);
export const clienteSchemaCrear = z.object(
    {
        nombre: z.string().describe('Nombre').min(1, { message: 'El nombre es obligatorio' }),
        documento: z.string().describe('Documento').optional(),
        telefono: z.string().describe('Teléfono').optional(),
        email: z.string().describe("Correo electrónico").email({ message: 'El email es inválido' }).optional(),
        direccion: z.string().describe('Dirección').optional(),
    }
);

export const clienteSchemaAsignarMotocicleta = z.object(
    {
        motocicletaId: z.string().describe('ID de la motocicleta'),
        clienteId: z.string().describe('ID del cliente'),
        placa: z.string().describe('Placa de la motocicleta'),
        motocicleta: motocicletaSchemaCrear.describe('Motocicleta').optional(),
        extends: z.object({
            ocultos: z.array(z.string()).optional().default(["clienteId","motocicletaId"]),
        }
        ).describe('Extensiones').optional(),
    }
    )
