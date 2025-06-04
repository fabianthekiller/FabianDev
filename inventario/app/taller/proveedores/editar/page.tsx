import { obtenerEsquemaProveedorEditar } from "@/actions/proveedores/crud";
import FormComponent from "@/components/formComponent";
import prisma from "@/lib/prisma";
import { Card } from "primereact/card";




export default async function ProveedorEditarPage({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {

    const esquemaProveedor = await obtenerEsquemaProveedorEditar();
    const id_proveedor = searchParams?.id;
    if (!esquemaProveedor) {
        return (
            <div className="flex justify-content-center">
                <Card title="Error" className="w-6"
                    footer={
                        <div className="flex justify-content-center">
                            <button className="p-button p-component p-button-outlined">
                                <span className="p-button-icon pi pi-arrow-left"></span>
                                <a href="/taller/motocicletas">
                                    <span className="p-button-label">Volver</span>
                                </a>
                            </button>
                        </div>
                    }
                >
                    <p>Error al obtener el esquema del proveedor</p>
                </Card>
            </div>
        )
    }
    if (!id_proveedor) {
        return (
            <div className="flex justify-content-center">
                <Card title="Error" className="w-6"
                    footer={
                        <div className="flex justify-content-center">
                            <button className="p-button p-component p-button-outlined">
                                <span className="p-button-icon pi pi-arrow-left"></span>
                                <a href="/taller/motocicletas">
                                    <span className="p-button-label">Volver</span>
                                </a>
                            </button>
                        </div>
                    }
                >
                    <p>Error al obtener el id de el proveedor</p>
                </Card>
            </div>
        )
    }


    const esquemaParseado = typeof esquemaProveedor === 'string' ? JSON.parse(esquemaProveedor) : esquemaProveedor;

    const tipoCreacion = esquemaParseado.title;

    const keys = Object.keys(esquemaParseado.properties);

    const proveedor = prisma.proveedor.findUnique({
        where: {
            id: id_proveedor as string
        }
    });
    if (!proveedor) {
        return (
            <div className="flex justify-content-center">
                <Card title="Error" className="w-6"
                    footer={
                        <div className="flex justify-content-center">
                            <button className="p-button p-component p-button-outlined">
                                <span className="p-button-icon pi pi-arrow-left"></span>
                                <a href="/taller/motocicletas">
                                    <span className="p-button-label">Volver</span>
                                </a>
                            </button>
                        </div>
                    }
                >
                    <p>Error al obtener la motocicleta</p>
                </Card>
            </div>
        )
    }
    const proveedorData = await proveedor;
    if (!proveedorData) {
        return (
            <div className="flex justify-content-center">
                <Card title="Error" className="w-6"
                    footer={
                        <div className="flex justify-content-center">
                            <button className="p-button p-component p-button-outlined">
                                <span className="p-button-icon pi pi-arrow-left"></span>
                                <a href="/taller/motocicletas">
                                    <span className="p-button-label">Volver</span>
                                </a>
                            </button>
                        </div>
                    }
                >
                    <p>Error al obtener el proveedor</p>
                </Card>
            </div>)
    }



    const valoresIniciales =
        Object.keys(esquemaParseado.properties).reduce((acc: any, key: string) => {
            const propiedad = esquemaParseado.properties[key];
            if (propiedad.type === 'string') {
                acc[key] = proveedorData[key as keyof typeof proveedorData] || '';
            }
            else if (propiedad.type === 'number' && key === 'anio') {
                const value = new Date("01-01-"+"" + proveedorData[key as keyof typeof proveedorData])
                acc[key] = value 
            }
            else if (propiedad.type === 'number' && key !== 'anio') {
                acc[key] = proveedorData[key as keyof typeof proveedorData] || 0;
            }
            else if (propiedad.type === 'boolean') {
                acc[key] = proveedorData[key as keyof typeof proveedorData] || false;
            }
            else if (propiedad.type === 'array') {
                acc[key] = proveedorData[key as keyof typeof proveedorData] || [];
            }
            else if (propiedad.type === 'object') {
                acc[key] = proveedorData[key as keyof typeof proveedorData] || {};
            }
            else {
                acc[key] = proveedorData[key as keyof typeof proveedorData] || null;
            }
            return acc;
        }, {});


        
        

    return (

        <div className="flex justify-content-center">
            <FormComponent modo="editar" esquema={esquemaProveedor} valoresIniciales={
                valoresIniciales}
                tipoCreacion={"proveedor"}

            />
            {/* <FormComponent modo="editar
            " /> */}
        </div>
    );

}
