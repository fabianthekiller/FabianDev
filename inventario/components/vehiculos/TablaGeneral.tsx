"use client";


import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { initVehiculos } from '@/actions/motocicleta/init';
import { FC, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { obtenerTodasLasMotos } from '@/actions/motocicleta/crud';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { eliminarElemento } from '@/actions/deleter';
import moment from 'moment';
import 'moment/locale/es';


moment.locale('es');


interface Vehiculo {
    unidades: any;
    keys?: any;
    esquema?: any;
    Tipo?: string;
    crearRuta?: string;
    editarRuta?: string;
    asignarRuta?: string;
    eliminarFCN?: (id: string) => any;
}


export const VehiculosTabla: FC<Vehiculo> = ({
    unidades, esquema, keys, Tipo,
    crearRuta, editarRuta, eliminarFCN, asignarRuta
}) => {

    const [inicializandoMotos, setInicializandoMotos] = useState(false);
    const [cargandoDataMotos, setCargandoDataMotos] = useState(false);
    const [elementosData, setElementosData] = useState<null | any[]>(null);
    const [motoSeleccionada, setMotoSeleccionada] = useState<any>(null);

    const router = useRouter();

    // actualizar datos

    const updateData = async () => {
        setCargandoDataMotos(true);
        const response = await obtenerTodasLasMotos();
        if (response) {
            setElementosData(response as []);
            setCargandoDataMotos(false);
        }
    }



    useEffect(() => {
        if (elementosData === null) {
            setCargandoDataMotos(true);
            // Convertir la cadena JSON a un objeto JavaScript
            const motosObj = JSON.parse(unidades);
            if (motosObj) {
                setElementosData(motosObj);
                setCargandoDataMotos(false);
            }
            else {
                setElementosData([])
                setCargandoDataMotos(false);
            }
        }
    }, [elementosData, unidades]);


    const tipoSwitch = (tipo: string) => {
        switch (tipo) {
            case 'motocicletas':
                return 'Motocicleta';
            case 'partes':
                return 'Partes';
            case 'proveedores':
                return 'Proveedores';
            case 'servicios':
                return 'Servicios';
            case 'clientes':
                return 'Clientes';
            case 'reparaciones':
                return 'Reparaciones';
            case 'vehiculos':
                return 'Vehiculos';
            default:
                return 'Vehiculos';
        }
    }

    const op = useRef<OverlayPanel>(null);
    const toast = useRef<Toast>(null);
    const confirmarEliminar = useRef<ConfirmDialog>(null);

    const acceptarEliminarObjeto = async () => {
        const res = await eliminarElemento(motoSeleccionada.id, Tipo ? Tipo : 'vehiculos');
        

        if (res) {
            toast.current?.show({ severity: 'success', summary: 'Eliminado', detail: 'El objeto ha sido eliminado', life: 3000 });
            setElementosData((prev) => (prev ? prev.filter((item) => item.id !== motoSeleccionada.id) : null));
            setMotoSeleccionada(null);
        }
        else {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el objeto', life: 3000 });
        }
    }

    const rejectEliminarObjeto = () => {
        toast.current?.show({ severity: 'error', summary: 'Cancelado', detail: 'Eliminación cancelada', life: 3000 });
    }

    const eliminarObjeto = () => {
        if (motoSeleccionada) {
            confirmDialog({
                message: '¿Está seguro de que desea eliminar?',
                header: 'Confirmar eliminación',
                icon: 'pi pi-exclamation-triangle',
                accept: acceptarEliminarObjeto,
                reject: rejectEliminarObjeto,
                acceptLabel: 'Eliminar',
                rejectLabel: 'Cancelar',
                acceptClassName: 'p-button-danger',
                rejectClassName: 'p-button-secondary',
                blockScroll: true,
                draggable: false,
                resizable: false,
            });
        }
        else {
            toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'Seleccione un objeto para eliminar', life: 3000 });
        }

    }
    return (
        <div className="grid w-full">
            <Toast ref={toast}
                position='top-center'
            />

            <OverlayPanel ref={op}
                className='shadow-5'
                showCloseIcon
            >

                {
                    motoSeleccionada && (
                        <img src={motoSeleccionada.imagen} alt={"foto"} className="w-30rem h-30rem"
                            style={{ objectFit: 'contain' }}
                        />
                    )
                }
            </OverlayPanel>

            <ConfirmDialog ref={confirmarEliminar} />



            <div className="col-12">




                <div className="card flex justify-content-center mb-4 shadow-2 border-round">
                    <DataTable
                        header={
                            <Toolbar className="mb-4  border-round"
                                start={
                                    <div className="flex align-items-center">
                                        <h2 className="m-0">{
                                            tipoSwitch(Tipo ? Tipo : 'vehiculos')

                                        }

                                        </h2>
                                    </div>

                                }
                                center={
                                    <div className="flex align-items-center">
                                        <Button icon="pi pi-plus" className="p-button-success mr-2"
                                            tooltip={'Crear ' + tipoSwitch(Tipo ? Tipo : 'vehiculos')}
                                            tooltipOptions={{ position: 'top' }}
                                            onClick={() => {
                                                router.push(crearRuta ? crearRuta : '/taller/vehiculos/crear');
                                            }
                                            }
                                        />
                                        <Button icon="pi pi-pencil" className="p-button-warning mr-2"
                                            tooltip={'Editar ' + tipoSwitch(Tipo ? Tipo : 'vehiculos')}
                                            tooltipOptions={{ position: 'top' }}
                                            onClick={() => {
                                                router.push(editarRuta ? editarRuta+ '?id=' + motoSeleccionada?.id : motoSeleccionada ? '/taller/vehiculos/editar?id=' + motoSeleccionada.id : '/taller/vehiculos/editar');
                                            }
                                            }
                    
                                            
                                            
                                            disabled={motoSeleccionada === null}
                                        />
                                        <Button icon="pi pi-trash" className="p-button-danger mr-2"

                                            tooltip={'Eliminar ' + tipoSwitch(Tipo ? Tipo : 'vehiculos')}
                                            tooltipOptions={{ position: 'top' }}
                                            onClick={
                                                eliminarObjeto
                                            }
                                            disabled={motoSeleccionada === null}
                                            hidden={true}

                                        />

                                    </div>

                                }
                                end={
                                    <div className="flex align-items-center">
                                        <Button tooltip='Inicializar' icon="pi pi-refresh" className="p-button-info mr-2"
                                            onClick={async () => {
                                                // Inicializar la tabla de vehiculos
                                                // initVehiculos();
                                                setInicializandoMotos(true);
                                                await initVehiculos()
                                                

                                                setInicializandoMotos(false);
                                                await updateData();
                                            }
                                            }
                                            disabled={elementosData !== null && elementosData.length > 0}
                                            loading={inicializandoMotos}
                                        />
                                    </div>
                                }
                            >

                            </Toolbar>
                        }
                        tableClassName=''
                        value={elementosData}
                        className='w-full '
                        scrollHeight='600px'
                        scrollable
                        virtualScrollerOptions={{ itemSize: 46 }}
                        dataKey="id"
                        selectionMode="single"
                        selection={motoSeleccionada}
                        onSelectionChange={(e) => {
                            setMotoSeleccionada(e.value);
                        }}
                        size='small'
                        showGridlines
                        loading={cargandoDataMotos}
                    >

                        <Column
                            headerStyle={{ width: '3rem', textAlign: 'center' }}
                            bodyStyle={{ textAlign: 'center' }}
                            body={(rowData, options) => {
                                return (
                                    <span> {options.rowIndex + 1} </span>
                                );
                            }
                            }
                        />
                        <Column selectionMode='single' style={{ width: '3rem' }} />


                        {
                            keys.map((key: string, index: number) => {
                                return (
                                    <Column
                                        key={index}
                                        field={key}
                                        hidden={key === 'id' || key === 'createdAt' || key === 'updatedAt' || esquema.properties[key]?.description?.toLowerCase().includes("id")}
                                        header={esquema.properties[key].description}
                                        sortable= {
                                            key !== 'imagen' && key !== 'ClienteMotocicleta' && key !== 'ReparacionPartes'
                                        }
                                        filter={
                                            key !== 'imagen' && key !== 'ClienteMotocicleta' && key !== 'ReparacionPartes'
                                        }
                                        filterPlaceholder={`Buscar ${esquema.properties[key].nombre}`}
                                        filterField={key}
                                        filterMatchMode="contains"
                                        body={(rowData) => {

                                            if (key === 'imagen') {
                                                return (
                                                    <>
                                                        <div className="flex justify-content-center gap-2">
                                                            <img src={rowData[key]} alt={rowData[key]} className="w-4rem h-4rem"
                                                                style={{ objectFit: 'contain' }}
                                                            />
                                                            <Button icon="pi pi-search" className="p-button-secondary mr-2"
                                                                onClick={(e) => {
                                                                    setMotoSeleccionada(rowData);
                                                                    op.current?.toggle(e);
                                                                }
                                                                }
                                                                text
                                                                tooltip={'Ver imagen'}
                                                                tooltipOptions={{ position: 'top' }}
                                                            />
                                                        </div>
                                                    </>
                                                );
                                            
                                            }

                                            if(key === 'fecha') {
                                                const fecha= moment(rowData[key]).format('DD/MM/YYYY');
                                                return (
                                                   <InputText value={fecha} readOnly className='w-full' 
                                                   tooltip={
                                                    moment(rowData[key]).format('dddd DD [de] MMMM [del] YYYY')
                                                   }
                                                   tooltipOptions={{position:'top'}}
                                                   />
                                                );
                                                
                                            }

                                            if (esquema.properties[key].type === 'object') {

                                                if (rowData[key] === null) {
                                                    return (
                                                        <span>No encontrado</span>
                                                    );
                                                }

                                                if (rowData[key]?.nombre){
                                                    return (
                                                        <span>{rowData[key]?.nombre}</span>
                                                    );
                                                }
                                                if (rowData[key]?.name) {

                                                    return (
                                                        <span>{rowData[key]?.name}</span>
                                                    );
                                                }
                                                

                                                return (
                                                    <span>{rowData[key]?.nombre}</span>
                                                );



                                            }


                                            {
                                                if (esquema.properties[key].type === 'array' && key === 'ClienteMotocicleta') {
                                                    
                                                    
                                                    
                                                    return (
                                                        <div className='grid justify-content-center gap-2'>
                                                            <div className='col-12 flex justify-content-center'>
                                                                <Button label="Asignar"
                                                                    icon="pi pi-plus"
                                                                    disabled={motoSeleccionada?.id !== rowData.id}
                                                                    className="p-button-success mr-2"
                                                                    tooltip={'Asignar'}
                                                                    tooltipOptions={{ position: 'top' }}
                                                                    onClick={() => {
                                                                        router.push(asignarRuta ? asignarRuta + '?cliente=' + rowData.id : '/taller/vehiculos/asignar?cliente=' + rowData?.id);
                                                                    }
                                                                    }
                                                                />

                                                            </div>
                                                            <div className='col-12'>
                                                                <ul className='list-none'>
                                                                    {
                                                                        Object.keys(rowData[key]).map((item: string, index: number) => {
                                                                            return (
                                                                                <li key={index} className='flex justify-content-center'>
                                                                                    <div className="card p-3 shadow-2 border-round w-full mt-5" style={{ backgroundColor: '#f4f4f4', border: '1px solid #ccc' }}>
                                                                                        <div className="flex justify-content-between align-items-center">
                                                                                            <span className="font-bold text-lg">{rowData[key][item]?.motocicleta?.marca}</span>
                                                                                            <img src={rowData[key][item]?.motocicleta?.imagen} alt={rowData[key][item]?.motocicleta?.marca} className="w-10rem h-10rem"
                                                                                                style={{ objectFit: 'contain' }}
                                                                                            />
                                                                                            <span className="font-bold text-lg">{rowData[key][item]?.motocicleta?.modelo}</span>
                                                                                        </div>
                                                                                        <div className="flex justify-content-center mt-2">
                                                                                            <span className="text-2xl font-bold" style={{ color: '#555' }}>{rowData[key][item]?.placa}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </li>
                                                                            );
                                                                        }
                                                                        )
                                                                    }
                                                                </ul>

                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            }


                                            {
                                                if (esquema.properties[key].type === 'array' && key === 'ReparacionPartes') {
                                                    
                                                    
                                                    
                                                    return (
                                                        <div className='grid justify-content-center gap-2'>
                                                            <div className='col-12 flex justify-content-center'>
                                                                <Button label="Asignar"
                                                                    icon="pi pi-plus"
                                                                    disabled={motoSeleccionada?.id !== rowData.id}
                                                                    className="p-button-success mr-2"
                                                                    tooltip={'Asignar'}
                                                                    tooltipOptions={{ position: 'top' }}
                                                                    onClick={() => {
                                                                        router.push(asignarRuta ? asignarRuta + '?cliente=' + rowData.id : '/taller/vehiculos/asignar?cliente=' + rowData?.id);
                                                                    }
                                                                    }
                                                                />

                                                            </div>
                                                            <div className='col-12'>
                                                                <ul className='list-none'>
                                                                    {
                                                                        Object.keys(rowData[key]).map((item: string, index: number) => {
                                                                            return (
                                                                                <li key={index} className='flex justify-content-center'>
                                                                                    <div className="card shadow-2 border-round w-full" style={{ backgroundColor: '#f4f4f4', border: '1px solid #ccc' }}>
                                                                                        <div className="flex justify-content-between align-items-center">
                                                                                            <span className="font-bold text-lg">{rowData[key][item]?.parte?.nombre}</span>
                                                                                            <img src={rowData[key][item]?.parte?.imagen} alt={rowData[key][item]?.parte?.nombre} className="w-5rem h-5rem"
                                                                                                style={{ objectFit: 'contain' }}
                                                                                            />
                                                                                           
                                                                                        </div>
                                                                                    </div>
                                                                                </li>
                                                                            );
                                                                        }
                                                                        )
                                                                    }
                                                                </ul>

                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            }


                                            return (
                                                <span>{rowData[key]}</span>
                                            );
                                        }
                                        }
                                    />
                                );
                            })
                        }


                    </DataTable>
                </div>



            </div>



        </div>
    );
}
