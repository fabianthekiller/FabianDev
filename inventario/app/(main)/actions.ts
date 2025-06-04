"use server";

import prisma from "@/lib/prisma";

export async function getData() {
    const motos = await prisma.motocicleta.count();
    const clientes = await prisma.cliente.count();
    const reparaciones = await prisma.reparacion.count();
    const partes = await prisma.partes.count();
  
    // Obtener reparaciones por mes
    const reparacionesPorMes = await prisma.reparacion.groupBy({
      by: ['estado'],
      _count: true
    });
  
    // Obtener total facturado 
    const facturas = await prisma.factura.aggregate({
      _sum: {
        total: true
      }
    });
  
    return {
      motos,
      clientes,
      reparaciones,
      partes,
      reparacionesPorMes,
      totalFacturado: facturas._sum.total || 0
    };
  }