import { obtenerEsquemaReparacionEditar } from "@/actions/reparacion/crud";
import FormComponent from "@/components/formComponent";
import prisma from "@/lib/prisma";
import { Card } from "primereact/card";




export default async function MotocicletaEditarPage({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {

    const esquemdaReparacion = await obtenerEsquemaReparacionEditar();
    const id_reparacion = searchParams?.id;
    if (!esquemdaReparacion) {
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
                    <p>Error al obtener el esquema de la reparación</p>
                </Card>
            </div>
        )
    }
    if (!id_reparacion) {
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
                    <p>Error al obtener el id de la reparación</p>
                </Card>
            </div>
        )
    }


    const esquemaParseado = typeof esquemdaReparacion === 'string' ? JSON.parse(esquemdaReparacion) : esquemdaReparacion;

    const tipoCreacion = esquemaParseado.title;

    const keys = Object.keys(esquemaParseado.properties);

    const reparacion = prisma.reparacion.findUnique({
        where: {
            id: id_reparacion as string
        },
        include: {
            cliente: true,
            mecanico: true,
            ReparacionPartes:true,
        }
    });
    if (!reparacion) {
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
                    <p>Error al obtener la reparación</p>
                </Card>
            </div>
        )
    }
    const reparacionData = await reparacion;
    if (!reparacionData) {
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
                    <p>Error al obtener la reparación</p>
                </Card>
            </div>)
    }



    const valoresIniciales =
        Object.keys(esquemaParseado.properties).reduce((acc: any, key: string) => {
            const propiedad = esquemaParseado.properties[key];
            if (propiedad.type === 'string' && key === 'fecha') {
                const rawValue = reparacionData[key as keyof typeof reparacionData];
                const value = rawValue instanceof Date ? rawValue : new Date(String(rawValue));
                acc[key] = value;
            }
            else if (propiedad.type === 'string') {
                acc[key] = reparacionData[key as keyof typeof reparacionData] || '';
            }
            else if (propiedad.type === 'number' && key === 'anio') {
                const value = new Date("01-01-"+"" + reparacionData[key as keyof typeof reparacionData])
                acc[key] = value 
            }
            else if (propiedad.type === 'number' && key !== 'anio') {
                acc[key] = reparacionData[key as keyof typeof reparacionData] || 0;
            }
            else if (propiedad.type === 'boolean') {
                acc[key] = reparacionData[key as keyof typeof reparacionData] || false;
            }
            else if (propiedad.type === 'array') {
                acc[key] = reparacionData[key as keyof typeof reparacionData] || [];
            }
            else if (propiedad.type === 'object') {
                acc[key] = reparacionData[key as keyof typeof reparacionData] || {};
            }
            else {
                acc[key] = reparacionData[key as keyof typeof reparacionData] || null;
            }
            return acc;
        }, {});


        
        

    return (

        <div className="flex justify-content-center">
            <FormComponent modo="editar" esquema={esquemdaReparacion} valoresIniciales={
                valoresIniciales}
                tipoCreacion={"reparacion"}

            />
            {/* <FormComponent modo="editar
            " /> */}
        </div>
    );

}
