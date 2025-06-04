import { obtenerEsquemaServicioEditar } from "@/actions/servicios/crud";
import FormComponent from "@/components/formComponent";
import prisma from "@/lib/prisma";
import { Card } from "primereact/card";




export default async function ServicioEditarPage({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {

    const esquemaServicio = await obtenerEsquemaServicioEditar();
    const id_servicio = searchParams?.id;
    if (!esquemaServicio) {
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
                    <p>Error al obtener el esquema de el servicio</p>
                </Card>
            </div>
        )
    }
    if (!id_servicio) {
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
                    <p>Error al obtener el id de el servicio</p>
                </Card>
            </div>
        )
    }


    const esquemaParseado = typeof esquemaServicio === 'string' ? JSON.parse(esquemaServicio) : esquemaServicio;

    const tipoCreacion = esquemaParseado.title;

    const keys = Object.keys(esquemaParseado.properties);

    const servicio = prisma.servicio.findUnique({
        where: {
            id: id_servicio as string
        }
    });
    if (!servicio) {
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
                    <p>Error al obtener el servicio</p>
                </Card>
            </div>
        )
    }
    const servicioData = await servicio;
    if (!servicioData) {
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
            </div>)
    }



    const valoresIniciales =
        Object.keys(esquemaParseado.properties).reduce((acc: any, key: string) => {
            const propiedad = esquemaParseado.properties[key];
            if (propiedad.type === 'string') {
                acc[key] = servicioData[key as keyof typeof servicioData] || '';
            }
            else if (propiedad.type === 'number' && key === 'anio') {
                const value = new Date("01-01-"+"" + servicioData[key as keyof typeof servicioData])
                acc[key] = value 
            }
            else if (propiedad.type === 'number' && key !== 'anio') {
                acc[key] = servicioData[key as keyof typeof servicioData] || 0;
            }
            else if (propiedad.type === 'boolean') {
                acc[key] = servicioData[key as keyof typeof servicioData] || false;
            }
            else if (propiedad.type === 'array') {
                acc[key] = servicioData[key as keyof typeof servicioData] || [];
            }
            else if (propiedad.type === 'object') {
                acc[key] = servicioData[key as keyof typeof servicioData] || {};
            }
            else {
                acc[key] = servicioData[key as keyof typeof servicioData] || null;
            }
            return acc;
        }, {});


        console.log("Valores iniciales de la servicio:", valoresIniciales);
        

    return (

        <div className="flex justify-content-center">
            <FormComponent modo="editar" esquema={esquemaServicio} valoresIniciales={
                valoresIniciales}
                tipoCreacion={"servicio"}

            />
            {/* <FormComponent modo="editar
            " /> */}
        </div>
    );

}
