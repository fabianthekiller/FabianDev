import { obtenerEsquemaParteEditar } from "@/actions/partes/crud";
import FormComponent from "@/components/formComponent";
import prisma from "@/lib/prisma";
import { Card } from "primereact/card";




export default async function ParteEditarPage({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {

    const esquemaParte = await obtenerEsquemaParteEditar();
    const id_parte = searchParams?.id;
    if (!esquemaParte) {
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
                    <p>Error al obtener el esquema de la parte</p>
                </Card>
            </div>
        )
    }
    if (!id_parte) {
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
                    <p>Error al obtener el id de la parte</p>
                </Card>
            </div>
        )
    }


    const esquemaParseado = typeof esquemaParte === 'string' ? JSON.parse(esquemaParte) : esquemaParte;

    const tipoCreacion = esquemaParseado.title;

    const keys = Object.keys(esquemaParseado.properties);

    const parte = prisma.partes.findUnique({
        where: {
            id: id_parte as string
        },
        include: {
            proveedor: true,
        }
    });
    if (!parte) {
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
                    <p>Error al obtener la parte</p>
                </Card>
            </div>
        )
    }
    const parteData = await parte;
    if (!parteData) {
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
                    <p>Error al obtener la parte</p>
                </Card>
            </div>)
    }



    const valoresIniciales =
        Object.keys(esquemaParseado.properties).reduce((acc: any, key: string) => {
            const propiedad = esquemaParseado.properties[key];
            if (propiedad.type === 'string') {
                acc[key] = parteData[key as keyof typeof parteData] || '';
            }
            else if (propiedad.type === 'number' && key === 'anio') {
                const value = new Date("01-01-"+"" + parteData[key as keyof typeof parteData])
                acc[key] = value 
            }
            else if (propiedad.type === 'number' && key !== 'anio') {
                acc[key] = parteData[key as keyof typeof parteData] || 0;
            }
            else if (propiedad.type === 'boolean') {
                acc[key] = parteData[key as keyof typeof parteData] || false;
            }
            else if (propiedad.type === 'array') {
                acc[key] = parteData[key as keyof typeof parteData] || [];
            }
            else if (propiedad.type === 'object') {
                acc[key] = parteData[key as keyof typeof parteData] || {};
            }
            else {
                acc[key] = parteData[key as keyof typeof parteData] || null;
            }
            return acc;
        }, {});


        console.log("Valores iniciales de la parte:", valoresIniciales);
        

    return (

        <div className="flex justify-content-center">
            <FormComponent modo="editar" esquema={esquemaParte} valoresIniciales={
                valoresIniciales}
                tipoCreacion={"parte"}

            />
            {/* <FormComponent modo="editar
            " /> */}
        </div>
    );

}
