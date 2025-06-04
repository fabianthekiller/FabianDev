import { obtenerClientePorId, obtenerEsquemaClienteAsignarMotocicleta } from "@/actions/cliente/crud";
import { crearParte  } from "@/actions/partes/crud";
import FormComponent from "@/components/formComponent";
import {  useSearchParams } from "next/navigation";
import { Card } from "primereact/card";




export default async function AsignarMotoPage({
    params,
    searchParams,
  }: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
  }) {

    const esquemaTipo = await obtenerEsquemaClienteAsignarMotocicleta();

    //get params



    const cliente = searchParams?.cliente;


    if (!cliente) {
        return (
            <div className="flex justify-content-center">
                <Card title="Error" className="w-6"
                footer={
                    <div className="flex justify-content-center">
                        <button className="p-button p-component p-button-outlined">
                            <span className="p-button-icon pi pi-arrow-left"></span>
                            <a href="/taller/clientes">
                                <span className="p-button-label">Volver</span>
                            </a>

                        </button>
                    </div>
                }
                >
                    <p>Cliente no encontrado</p>
                </Card>

            </div>
        )
    }


    // check if cliente exists, its a string and not empty
    if (typeof cliente !== 'string' || cliente.length === 0) {
        return (
            <div className="flex justify-content-center">
                <Card title="Error" className="w-6"
                footer={
                    <div className="flex justify-content-center">
                        <button className="p-button p-component p-button-outlined">
                            <span className="p-button-icon pi pi-arrow-left"></span>
                            <a href="/taller/clientes">
                                <span className="p-button-label">Volver</span>
                            </a>

                        </button>
                    </div>
                }
                >
                    <p>Cliente no encontrado</p>
                </Card>
            </div>
        )
    }

    // provided hex string representation must be exactly 12 bytes,

    // or a 24-character hex string

    if (cliente.length !== 24) {
        return (
            <div className="flex justify-content-center">
                <Card title="Error" className="w-6"
                footer={
                    <div className="flex justify-content-center">
                        <button className="p-button p-component p-button-outlined">
                            <span className="p-button-icon pi pi-arrow-left"></span>
                            <a href="/taller/clientes">
                                <span className="p-button-label">Volver</span>
                            </a>

                        </button>
                    </div>
                }
                >
                    <p>Cliente no encontrado</p>
                </Card>
            </div>
        )
    }


    // check if cliente is in the database

    const clienteres = await obtenerClientePorId(cliente);
    if (!clienteres) {
        return (
            <div className="flex justify-content-center">
                <Card title="Error" className="w-6"
                footer={
                    <div className="flex justify-content-center">
                        <button className="p-button p-component p-button-outlined">
                            <span className="p-button-icon pi pi-arrow-left"></span>
                            <a href="/taller/clientes">
                                <span className="p-button-label">Volver</span>
                            </a>

                        </button>
                    </div>
                }
                >
                    <p>Cliente no encontrado</p>
                </Card>
            </div>
        )
    }



    

    const esquemaParseado = typeof esquemaTipo === 'string' ? JSON.parse(esquemaTipo) : esquemaTipo;

    const tipoCreacion = esquemaParseado.title;

    const keys = Object.keys(esquemaParseado.properties);


    const valoresIniciales = Object.keys(esquemaParseado.properties).reduce((acc: any, key: string) => {
        const propiedad = esquemaParseado.properties[key];
        if (propiedad.type === 'string') {
            acc[key] = '';
        }
        else if (propiedad.type === 'number' && key === 'anio') {
            acc[key] = new Date()
        }
        else if (propiedad.type === 'number' && key !== 'anio') {
            acc[key] = 0;
        }
        else if (propiedad.type === 'boolean') {
            acc[key] = false;
        }
        else if (propiedad.type === 'array') {
            acc[key] = [];
        }
        else if (propiedad.type === 'object') {
            acc[key] = {};
        }
        else {
            acc[key] = null;
        }
        return acc;
    }, {});


    return (

        <div className="flex justify-content-center">
            <FormComponent modo="asignar" esquema={esquemaTipo} valoresIniciales={
                valoresIniciales}
                tipoCreacion={"clienteAsignarMotocicleta"}
                preasignado ={{
                    clienteId: clienteres?.id,
                    cliente: clienteres,
                    motocicletaId: null,
                    motocicleta: null,
                }}

                />
            {/* <FormComponent modo="editar
            " /> */}
        </div>
    );

}
