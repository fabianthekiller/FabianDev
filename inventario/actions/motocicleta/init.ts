"use server";
import prisma from "@/lib/prisma";

export async function initVehiculos() {

    /**
     * Crear data aleatoria para la tabla de vehiculos en este caso motocicletas vendidas en Colombia
     * bajo este esquema de datos
     * 
     *   id          String   @id @default(auto()) @map("_id") @db.ObjectId
      marca       String
      modelo      String
      anio        Int
      descripcion String?
      imagen      String?
      createdAt   DateTime @default(now())
      updatedAt   DateTime @updatedAt
    
        *
     */


    const marcas = ['Yamaha', 'Honda', 'Suzuki', 'Kawasaki', 'BMW', 'Ducati', 'Harley-Davidson', 'KTM', 'Triumph', 'Royal Enfield'];
    const modelos = ['Sport', 'Cruiser', 'Touring', 'Standard', 'Adventure', 'Dual-Sport', 'Scooter', 'Electric', 'Naked', 'Custom'];
    const anios = Array.from({ length: 20 }, (_, i) => 2003 + i); // Years from 2003 to 2022
    const vehiculos = [];

    for (let i = 0; i < 200; i++) {
        const vehiculo = {
            marca: marcas[Math.floor(Math.random() * marcas.length)],
            modelo: modelos[Math.floor(Math.random() * modelos.length)],
            anio: anios[Math.floor(Math.random() * anios.length)],
            descripcion: Math.random() > 0.5 ? `Descripción del modelo ${i + 1}` : null,
            imagen: Math.random() > 0.5 ? `https://example.com/image${i + 1}.jpg` : null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        vehiculos.push(vehiculo);
    }

    console.log(vehiculos);



    // Guardar vehiculos en la base de datos

    const respuesta = await prisma.motocicleta.createMany({
        data: vehiculos

    })
    console.log(respuesta);
}

