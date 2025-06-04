"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import FormData from 'form-data';

export interface FacturaData {
    clienteId: string;
    reparacionId: string;
    numero: string;
    serie: string;
    tipo: string;
    formaPago: string;
    metodoPago: string;
    moneda: string;
    subtotal: number;
    descuento: number;
    impuesto: number;
    fecha: Date;
    total: number;
    servicios: {
        id: string;
        nombre: string;
        tiempoEstimado: string;
        precio: number;
    }[];
    reparaciones: {
        id: string;
        nombre: string;
        descripcion: string;
        estado: string;
        fecha: Date;
        precioTotal: number;
        clienteId: string;
    }[];
}

export async function crearFactura(facturaData: FacturaData) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "No autorizado" };
        }

        // Crear la factura con los datos JSON
        const factura = await prisma.factura.create({
            data: {
                clienteId: facturaData.clienteId,
                numero: facturaData.numero,
                serie: facturaData.serie,
                tipo: facturaData.tipo,
                formaPago: facturaData.formaPago,
                metodoPago: facturaData.metodoPago,
                moneda: facturaData.moneda,
                subtotal: facturaData.subtotal,
                descuento: facturaData.descuento,
                impuesto: facturaData.impuesto,
                fecha: facturaData.fecha,
                total: facturaData.total,
                servicios: facturaData.servicios,
                reparaciones: facturaData.reparaciones
            },
            include: {
                cliente: true,
            }
        });

        // Actualizar estado de reparaciones
        for (const reparacion of facturaData.reparaciones) {
            await prisma.reparacion.update({
                where: { id: reparacion.id },
                data: { estado: "FACTURADO" }
            });
        }

        return {
            success: true,
            data: factura
        };

    } catch (error) {
        console.error("Error al crear factura:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Error al crear la factura"
        };
    }
}

export async function obtenerTodosLosFacturasClientePorDocumento(documento: string) {
    try {
        const facturas = await prisma.factura.findMany({
            where: {
                cliente: {
                    documento: documento
                }
            },
            include: {
                cliente: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return facturas;
    } catch (error) {
        console.error("Error al obtener facturas:", error);
        return null;
    }
}

export async function generarPDFFactura(facturaId: string) {
    try {
        const factura = await prisma.factura.findUnique({
            where: { id: facturaId },
            include: {
                cliente: true
            }
        });

        if (!factura) {
            return { success: false, error: "Factura no encontrada" };
        }

        // Obtener servicios y reparaciones del JSON
        const servicios = factura.servicios as any[];
        const reparaciones = factura.reparaciones as any[];

        // Leer y subir la plantilla
        const templatePath = path.join(process.cwd(), 'public', 'factura_template.docx');
        const templateBuffer = await fs.readFile(templatePath);
        const formData = new FormData();
        formData.append('template', templateBuffer, 'factura_template.docx');

        // Subir plantilla
        const uploadResponse = await axios.post('http://11.52.0.10:4000/template', formData, {
            headers: formData.getHeaders()
        });

        if (!uploadResponse.data.data.templateId) {
            throw new Error('No se pudo obtener el ID de la plantilla');
        }

        const templateId = uploadResponse.data.data.templateId;

        const QRCode = require('qrcode')
        const qrCodeData = `Factura: ${factura.numero}\nCliente: ${factura.cliente.nombre}\nFecha: ${new Date(factura.fecha).toLocaleDateString('es-CO')}`;
        const qrCodeImage = await QRCode.toDataURL(qrCodeData, { errorCorrectionLevel: 'H' });

        // Preparar datos para el PDF
        const data: {
            empresa: {
                nombre: string;
                nit: string;
                direccion: string;
                telefono: string;
                email: string;
            };
            factura: any;
            cliente: any;
            servicios: any[];
            reparaciones: any[];
            totales: any;
            factQR?: string;
        } = {
            empresa: {
                nombre: "ROSAL MOTOS",
                nit: "900.123.456-7",
                direccion: "El Rosal Cauca",
                telefono: "(+57) 310 123 4567",
                email: "contacto@rosalmotos.com",
            },
            factura: {
                numero: factura.numero,
                serie: factura.serie,
                fecha: new Date(factura.fecha).toLocaleDateString('es-CO'),
                formaPago: factura.formaPago,
                metodoPago: factura.metodoPago
            },
            cliente: {
                nombre: factura.cliente.nombre,
                documento: factura.cliente.documento,
                telefono: factura.cliente.telefono || 'N/A',
                email: factura.cliente.email || 'N/A'
            },
            servicios: servicios.map(s => ({
                nombre: s.nombre,
                tiempoEstimado: s.tiempoEstimado,
                precio: Number(s.precio).toLocaleString('es-CO')
            })),
            reparaciones: reparaciones.map(r => ({
                nombre: r.nombre,
                descripcion: r.descripcion,
                fecha: new Date(r.fecha).toLocaleDateString('es-CO'),
                precioTotal: Number(r.precioTotal).toLocaleString('es-CO')
            })),
            totales: {
                subtotalServicios: servicios.reduce((sum, s) => sum + Number(s.precio), 0),
                subtotalReparaciones: reparaciones.reduce((sum, r) => sum + Number(r.precioTotal), 0),
                subtotal: Number(factura.subtotal).toLocaleString('es-CO'),
                iva: Number(factura.impuesto).toLocaleString('es-CO'),
                descuento: Number(factura.descuento).toLocaleString('es-CO'),
                total: Number(factura.total).toLocaleString('es-CO')
            },
        };


        // Generar PDF
        const renderResponse = await axios.post(`http://11.52.0.10:4000/render/${templateId}`, {
            data: data,
            convertTo: "pdf"
        });

        const pdfResponse = await axios.get(
            `http://11.52.0.10:4000/render/${renderResponse.data.data.renderId}`,
            { responseType: 'arraybuffer' }
        );

        // Convertir a base64
        const base64 = Buffer.from(pdfResponse.data).toString('base64');

        return {
            success: true,
            data: base64,
            contentType: 'application/pdf'
        };

    } catch (error) {
        console.error("Error al generar PDF:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Error al generar el PDF"
        };
    }
}