//@ts-nocheck
"use client";
import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';
import { Toast } from 'primereact/toast';
import { obtenerClientePorDocumento } from '@/actions/cliente/crud';
import { obtenerReparacionesPorDocumentoCliente } from '@/actions/reparacion/crud';
import { obtenerTodosLosServicios } from '@/actions/servicios/crud';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { crearFactura, FacturaData, obtenerTodosLosFacturasClientePorDocumento } from '@/actions/facturas/crud';
import { generarPDFFactura } from '@/actions/facturas/crud';
import { TabPanel, TabView } from 'primereact/tabview';
import axios from 'axios';



interface Servicio {
    id: string;
    nombre: string;
    tiempoEstimado: string;
    precio: number;
}

interface Cliente {
    nombre: string;
    documento: string;
    telefono?: string;
    email?: string;
}

interface Reparacion {
    id: string;
    nombre: string;
    descripcion: string;
    estado: string;
    fecha: Date;
    precioTotal: number;
}


interface Factura {
    id: string;
    clienteId: string;
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
    servicios: Servicio[];
    reparaciones: Reparacion[];
    cliente?: Cliente;
    reparacion?: Reparacion;
}

interface ReparacionSeleccion extends Reparacion {
    selected?: boolean;
}

const FacturaCMP = () => {
    const [documentoCliente, setDocumentoCliente] = useState<string>('');
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [reparaciones, setReparaciones] = useState<ReparacionSeleccion[]>([]);
    const [serviciosDisponibles, setServiciosDisponibles] = useState<Servicio[]>([]);
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState<Servicio[]>([]);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formaPago, setFormaPago] = useState<string>('CONTADO');
    const [metodoPago, setMetodoPago] = useState<string>('EFECTIVO');
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [facturasAnteriores, setFacturasAnteriores] = useState<Factura[]>([]);
    const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);
    const [detallesVisible, setDetallesVisible] = useState(false);


    const toast = useRef<Toast>(null);


    // Agregar después de cargarReparacionesCliente:
    const cargarFacturasAnteriores = async (documento: string) => {
        try {
            const response = await obtenerTodosLosFacturasClientePorDocumento(documento);
            if (response && response.length > 0) {
                setFacturasAnteriores(response);
            } else {
                setFacturasAnteriores([]);
            }
        } catch (error) {
            console.error("Error al cargar facturas:", error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al cargar facturas anteriores'
            });
        }
    };


    // Agregar esta función dentro del componente
    const imprimirFactura = async (facturaId: string) => {
        try {
            const resultado = await generarPDFFactura(facturaId);

            if (resultado.success && resultado.data) {
                const byteCharacters = atob(resultado.data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);

                setPdfUrl(url);
                setVisible(true);
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: resultado.error || 'Error al generar la factura'
                });
            }
        } catch (error) {
            console.error('Error al imprimir factura:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al generar el PDF'
            });
        }
    };

    const buscarCliente = async () => {
        setLoading(true);
        try {
            const response = await obtenerClientePorDocumento(documentoCliente);

            


            if (response) {
                setCliente(response);
                await cargarReparacionesCliente(response);
                await cargarServiciosDisponibles();
                await cargarFacturasAnteriores(response.documento); // Agregar esta línea
            } else {
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Cliente no encontrado',
                    detail: 'No se encontró un cliente con ese documento'
                });
                setCliente(null);
                setReparaciones([]);
            }

        } catch (error) {
            console.error("Error al buscar cliente:", error);
        } finally {
            setLoading(false);
        }
    };

    const precioBodyTemplate = (rowData: any) => {
        let precio = 0;
        
        // Si es un número directo
        if (typeof rowData === 'number') {
            precio = rowData;
        } 
        // Si es un objeto con precio o precioTotal
        else if (typeof rowData === 'object') {
            if (rowData?.precio) {
                precio = Number(rowData.precio);
            } else if (rowData?.precioTotal) {
                precio = Number(rowData.precioTotal);
            } else if (rowData?.total) {
                precio = Number(rowData.total);
            }
        }
    
        // Asegurar que sea un número válido y no NaN
        precio = isNaN(precio) ? 0 : precio;
    
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(precio);
    };
    


    const cargarReparacionesCliente = async (clienteDoc: string) => {
        try {
            const response = await obtenerReparacionesPorDocumentoCliente(clienteDoc.documento);

            


            if (response && response.length) {
                setReparaciones(response)
            }
            else {
                setReparaciones([]);
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Sin reparaciones',
                    detail: 'El cliente no tiene reparaciones registradas'
                });
            }

        } catch (error) {
            console.error("Error al cargar reparaciones:", error);
        }
    };

    const cargarServiciosDisponibles = async () => {
        try {
            const response = await obtenerTodosLosServicios()
            
            if (response && response.length) {
                setServiciosDisponibles(response);
            } else {
                setServiciosDisponibles([]);
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Sin servicios',
                    detail: 'No hay servicios disponibles'
                });
            }
        } catch (error) {
            console.error("Error al cargar servicios:", error);
        }
    };

    const agregarServicio = (servicio: Servicio) => {
        setServiciosSeleccionados([...serviciosSeleccionados, servicio]);
    };

    const calcularTotal = () => {
        // Sumar reparaciones seleccionadas
        const totalReparaciones = reparaciones
            .filter(rep => rep.selected)
            .reduce((sum, rep) => {
                // Imprimir para debug
                

                // Convertir explícitamente a número
                const precio = Number(rep.precioTotal) || 0;
                return sum + precio;
            }, 0);

        // Sumar servicios seleccionados
        const totalServicios = serviciosSeleccionados
            .reduce((sum, serv) => {
                // Imprimir para debug
                

                // Convertir explícitamente a número
                const precio = Number(serv.precio) || 0;
                return sum + precio;
            }, 0);

        
        
        

        return totalReparaciones + totalServicios;
    };

    const crearFactura_ = async () => {
        const reparacionesSeleccionadas = reparaciones.filter(rep => rep.selected);

        if (!cliente || reparacionesSeleccionadas.length === 0) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe seleccionar al menos una reparación'
            });
            return;
        }

        const subtotal = calcularTotal();
        const impuesto = parseFloat((subtotal * 0.19).toFixed(2));
        const total = parseFloat((subtotal + impuesto).toFixed(2));

        try {
            const facturaData: FacturaData = {
                clienteId: cliente.id,
                reparacionId: reparacionesSeleccionadas[0].id,
                numero: Date.now().toString(),
                serie: 'A',
                tipo: 'FACTURA',
                formaPago: formaPago,
                metodoPago: metodoPago,
                moneda: 'COP',
                subtotal: subtotal,
                descuento: 0,
                impuesto: impuesto,
                fecha: new Date(),
                total: total,
                servicios: serviciosSeleccionados.map(servicio => ({
                    id: servicio.id,
                    nombre: servicio.nombre,
                    tiempoEstimado: servicio.tiempoEstimado,
                    precio: parseFloat(servicio.precio.toString())
                })),
                reparaciones: reparacionesSeleccionadas.map(rep => ({
                    id: rep.id,
                    nombre: rep.nombre,
                    descripcion: rep.descripcion,
                    estado: rep.estado,
                    fecha: rep.fecha,
                    precioTotal: parseFloat(rep.precioTotal.toString()),
                    clienteId: rep.clienteId
                }))
            };

            const resultado = await crearFactura(facturaData);

            if (resultado.success) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Factura creada correctamente'
                });

                await imprimirFactura(resultado.data.id);

                // Actualizar la lista de facturas
                if (cliente) {
                    await cargarFacturasAnteriores(cliente.documento);
                }

                // Limpiar formulario
                setDocumentoCliente('');
                setCliente(null);
                setReparaciones([]);
                setServiciosSeleccionados([]);
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: resultado.error
                });
            }
        } catch (error) {
            console.error("Error al crear factura:", error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al crear la factura'
            });
        }
    };


    return (
        <div className="card">
            <Toast ref={toast} />

            <Dialog
                visible={visible}
                onHide={() => {
                    setVisible(false);
                    if (pdfUrl) {
                        URL.revokeObjectURL(pdfUrl);
                        setPdfUrl(null);
                    }
                }}
                style={{ width: '90vw' }}
                maximizable
            >
                {pdfUrl && (
                    <div style={{ height: '80vh' }}>
                        <iframe
                            src={pdfUrl}
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                overflow: 'auto'
                            }}
                            title="Vista previa de factura"
                        />
                    </div>
                )}
            </Dialog>



            <Dialog
                header="Detalles de la Factura"
                visible={detallesVisible}
                onHide={() => {
                    setDetallesVisible(false);
                    setFacturaSeleccionada(null);
                }}
                style={{ width: '70vw' }}
            >
                {facturaSeleccionada && (
                    <div className="grid">
                        <div className="col-12">
                            <h3>Información General</h3>
                            <p><strong>Número:</strong> {facturaSeleccionada.serie}-{facturaSeleccionada.numero}</p>
                            <p><strong>Fecha:</strong> {new Date(facturaSeleccionada.fecha).toLocaleDateString('es-CO')}</p>
                            <p><strong>Forma de Pago:</strong> {facturaSeleccionada.formaPago}</p>
                            <p><strong>Método de Pago:</strong> {facturaSeleccionada.metodoPago}</p>
                        </div>

                        <div className="col-12 md:col-6">
                            <h3>Servicios</h3>
                            <DataTable value={facturaSeleccionada.servicios || []}>
                                <Column field="nombre" header="Servicio" />
                                <Column field="precio" header="Precio" body={precioBodyTemplate} />
                            </DataTable>
                        </div>

                        <div className="col-12 md:col-6">
                            <h3>Reparaciones</h3>
                            <DataTable value={facturaSeleccionada.reparaciones || []}>
                                <Column field="nombre" header="Reparación" />
                                <Column field="precioTotal" header="Precio" body={precioBodyTemplate} />
                            </DataTable>
                        </div>

                        <div className="col-12">
                            <h3>Totales</h3>
                            <p><strong>Subtotal:</strong> {precioBodyTemplate(facturaSeleccionada.subtotal)}</p>
                            <p><strong>IVA (19%):</strong> {precioBodyTemplate(facturaSeleccionada.impuesto)}</p>
                            <p><strong>Total:</strong> {precioBodyTemplate(facturaSeleccionada.total)}</p>
                        </div>
                    </div>
                )}
            </Dialog>


            <Card title="Gestión de Facturas" className="h-full">
                <TabView>
                    <TabPanel header="Nueva Factura">

                        <Card title="Crear Factura">
                            <div className="grid">
                                <div className="col-12 md:col-12">
                                    <div className="p-inputgroup">
                                        <InputText
                                            value={documentoCliente}
                                            onChange={(e) => setDocumentoCliente(e.target.value)}
                                            placeholder="Documento del cliente"
                                        />
                                        <Button
                                            icon="pi pi-search"
                                            onClick={buscarCliente}
                                            loading={loading}
                                        />
                                    </div>
                                </div>

                                {cliente && (
                                    <>
                                        <div className="col-12">
                                            <Card title="Reparaciones del Cliente">
                                                <DataTable
                                                    value={reparaciones}
                                                    selection={reparaciones.filter(rep => rep.selected)}
                                                    onSelectionChange={(e) => {
                                                        const updatedReparaciones = reparaciones.map(rep => ({
                                                            ...rep,
                                                            selected: e.value.some(selected => selected.id === rep.id)
                                                        }));
                                                        setReparaciones(updatedReparaciones);
                                                    }}
                                                >
                                                    <Column selectionMode="multiple" />
                                                    <Column field="nombre" header="Reparación" />
                                                    <Column field="estado" header="Estado" />
                                                    <Column field="fecha" header="Fecha"
                                                        body={(rowData) => new Date(rowData.fecha).toLocaleDateString()}
                                                    />
                                                    <Column field="precioTotal" header="Precio"
                                                        body={(rowData) => precioBodyTemplate(rowData)}
                                                    />
                                                </DataTable>
                                            </Card>
                                        </div>

                                        <div className="col-12">
                                            <Card title="Agregar Servicios Adicionales">
                                                <MultiSelect
                                                    value={serviciosSeleccionados}
                                                    options={serviciosDisponibles}
                                                    onChange={(e) => setServiciosSeleccionados(e.value)}
                                                    optionLabel="nombre"
                                                    placeholder="Seleccionar servicios"
                                                    filter
                                                    display="chip"
                                                />

                                                <DataTable value={serviciosSeleccionados}>
                                                    <Column field="nombre" header="Servicio" />
                                                    <Column field="precio" header="Precio" body={precioBodyTemplate} />
                                                    <Column body={(rowData) => (
                                                        <Button
                                                            icon="pi pi-trash"
                                                            className="p-button-danger"
                                                            onClick={() => {
                                                                setServiciosSeleccionados(
                                                                    serviciosSeleccionados.filter(s => s.id !== rowData.id)
                                                                );
                                                            }}
                                                        />
                                                    )} />
                                                </DataTable>
                                            </Card>
                                        </div>


                                        <div className="col-12">
                                            <Card title="Facturas Anteriores">
                                                <DataTable
                                                    value={facturasAnteriores}
                                                    paginator
                                                    rows={5}
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    emptyMessage="No hay facturas anteriores"
                                                >
                                                    <Column field="numero" header="Número"
                                                        body={(rowData) => `${rowData.serie}-${rowData.numero}`}
                                                    />
                                                    <Column field="fecha" header="Fecha"
                                                        body={(rowData) => new Date(rowData.fecha).toLocaleDateString('es-CO')}
                                                    />
                                                    <Column field="total" header="Total" body={precioBodyTemplate} />
                                                    <Column field="formaPago" header="Forma de Pago" />
                                                    <Column field="metodoPago" header="Método de Pago" />
                                                    <Column
                                                        header="Servicios"
                                                        body={(rowData) => rowData.servicios?.length || 0}
                                                    />
                                                    <Column
                                                        header="Reparaciones"
                                                        body={(rowData) => rowData.reparaciones?.length || 0}
                                                    />
                                                    <Column
                                                        body={(rowData) => (
                                                            <Button
                                                                icon="pi pi-print"
                                                                className="p-button-rounded p-button-info"
                                                                onClick={() => imprimirFactura(rowData.id)}
                                                                tooltip="Reimprimir factura"
                                                                tooltipOptions={{ position: 'top' }}
                                                            />
                                                        )}
                                                    />
                                                </DataTable>
                                            </Card>
                                        </div>

                                        <div className="col-12 md:col-6">
                                            <div className="field">
                                                <label htmlFor="formaPago">Forma de Pago</label>
                                                <Dropdown
                                                    id="formaPago"
                                                    value={formaPago}
                                                    options={[
                                                        { label: 'Contado', value: 'CONTADO' },
                                                        { label: 'Crédito', value: 'CREDITO' }
                                                    ]}
                                                    onChange={(e) => setFormaPago(e.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-12 md:col-6">
                                            <div className="field">
                                                <label htmlFor="metodoPago">Método de Pago</label>
                                                <Dropdown
                                                    id="metodoPago"
                                                    value={metodoPago}
                                                    options={[
                                                        { label: 'Efectivo', value: 'EFECTIVO' },
                                                        { label: 'Tarjeta', value: 'TARJETA' },
                                                        { label: 'Transferencia', value: 'TRANSFERENCIA' }
                                                    ]}
                                                    onChange={(e) => setMetodoPago(e.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>

                                        <Divider />

                                        <div className="col-12">
                                            <div className="flex justify-content-between align-items-center">
                                                <div>
                                                    <h3>Subtotal: {precioBodyTemplate(Number(calcularTotal()).toFixed(2))}</h3>
                                                    <h3>IVA (19%): {precioBodyTemplate((Number(calcularTotal()) * 0.19).toFixed(2))}</h3>
                                                    <h3>Total: {precioBodyTemplate((Number(calcularTotal()) * 1.19).toFixed(2))}</h3>
                                                </div>
                                                <Button
                                                    label="Crear Factura"
                                                    icon="pi pi-check"
                                                    onClick={crearFactura_}
                                                />
                                            </div>
                                        </div>

                                    </>
                                )}
                            </div>
                        </Card>

                    </TabPanel>
                    <TabPanel header="Buscar Facturas">
                        <div className="p-fluid">
                            <div className="flex align-items-center gap-2">
                                <span className="p-input-icon-right flex-grow-1">
                                    <InputText
                                        className="w-full"
                                        value={documentoCliente}
                                        onChange={(e) => setDocumentoCliente(e.target.value)}
                                        placeholder="Buscar por documento del cliente"
                                    />
                                </span>
                                <Button
                                    icon="pi pi-search"
                                    onClick={buscarCliente}
                                    loading={loading}
                                />
                            </div>
                            {cliente && (
                                <div className="mt-3">
                                    <h3>Cliente: {cliente.nombre}</h3>
                                    <DataTable
                                        value={facturasAnteriores}
                                        paginator
                                        rows={10}
                                        emptyMessage="No hay facturas para mostrar"
                                    >
                                        <Column field="numero" header="Número"
                                            body={(rowData) => `${rowData.serie}-${rowData.numero}`}
                                        />
                                        <Column field="fecha" header="Fecha"
                                            body={(rowData) => new Date(rowData.fecha).toLocaleDateString('es-CO')}
                                        />
                                        <Column field="total" header="Total" body={precioBodyTemplate} />
                                        <Column field="formaPago" header="Forma de Pago" />
                                        <Column field="metodoPago" header="Método de Pago" />
                                        <Column
                                            header="Servicios"
                                            body={(rowData) => {
                                                const servicios = rowData.servicios || [];
                                                if (servicios.length === 0) return 'Sin servicios';
                                                return servicios.map(s => s.nombre).join(', ');
                                            }}
                                        />
                                        <Column
                                            header="Reparaciones"
                                            body={(rowData) => {
                                                const reparaciones = rowData.reparaciones || [];
                                                if (reparaciones.length === 0) return 'Sin reparaciones';
                                                return reparaciones.map(r => r.nombre).join(', ');
                                            }}
                                        />
                                        <Column
                                            body={(rowData) => (
                                                <div className="flex gap-2">
                                                    <Button
                                                        icon="pi pi-eye"
                                                        className="p-button-rounded p-button-secondary"
                                                        onClick={() => {
                                                            // Mostrar detalles en un Dialog
                                                            setFacturaSeleccionada(rowData);
                                                            setDetallesVisible(true);
                                                        }}
                                                        tooltip="Ver detalles"
                                                        tooltipOptions={{ position: 'top' }}
                                                    />
                                                    <Button
                                                        icon="pi pi-print"
                                                        className="p-button-rounded p-button-info"
                                                        onClick={() => imprimirFactura(rowData.id)}
                                                        tooltip="Reimprimir factura"
                                                        tooltipOptions={{ position: 'top' }}
                                                    />
                                                </div>
                                            )}
                                        />
                                    </DataTable>
                                </div>
                            )}
                        </div>
                    </TabPanel>
                    <TabPanel header="Prueba"
                    >
                        <div className="p-fluid">
                            <h3>Prueba de TabPanel</h3>
                            <p>Contenido de prueba para el TabPanel.</p>
                        </div>
                        <Button label="Descargar imagen"
                            onClick={() => {
                                const axios = require('axios');
                                axios.get('https://cdn-icons-png.flaticon.com/512/919/919825.png', {
                                    responseType: 'blob'
                                })
                                    .then((response: any) => {
                                        const url = window.URL.createObjectURL(new Blob([response.data]));
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.setAttribute('download', 'imagen_prueba.png');
                                        document.body.appendChild(link);
                                        link.click();
                                    })
                                    .catch((error: any) => {
                                        console.error("Error al descargar la imagen:", error);
                                    });

                            }}
                        />
                        <Button label="Descargar JSON"
                            onClick={() => {
                                const json = axios.get('https://jsonplaceholder.typicode.com/posts')
                                    .then((response: any) => {
                                        const data = response.data;
                                      
                                        
                                        

                                    })
                                    .catch((error: any) => {
                                        console.error("Error al descargar el JSON:", error);
                                    });
                            }
                        }
                        />

                        <Button label="Prueba de servidor"
                            onClick={async () => {              
                                const { prueba } = await import('@/actions/prueba');
                                try {
                                    const data = await prueba();
                                    
                                    toast.current?.show({
                                        severity: 'success',
                                        summary: 'Éxito',
                                        detail: 'Datos de prueba obtenidos correctamente'
                                    });
                                } catch (error) {
                                    console.error("Error en la prueba del servidor:", error);
                                    toast.current?.show({
                                        severity: 'error',
                                        summary: 'Error',
                                        detail: 'Error al obtener datos de prueba'
                                    });
                                }
                            }
                            }
                        />


                    </TabPanel>
                </TabView>
            </Card>

        </div>
    );
};

export default FacturaCMP;

