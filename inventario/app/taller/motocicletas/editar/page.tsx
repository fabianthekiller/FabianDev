import { obtenerEsquemaMoto } from "@/actions/motocicleta/crud";
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

    const esquemaMoto = await obtenerEsquemaMoto();
    const id_moto = searchParams?.id;
    if (!esquemaMoto) {
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
                    <p>Error al obtener el esquema de la motocicleta</p>
                </Card>
            </div>
        )
    }
    if (!id_moto) {
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
                    <p>Error al obtener el id de la motocicleta</p>
                </Card>
            </div>
        )
    }


    const esquemaParseado = typeof esquemaMoto === 'string' ? JSON.parse(esquemaMoto) : esquemaMoto;

    const tipoCreacion = esquemaParseado.title;

    const keys = Object.keys(esquemaParseado.properties);

    const moto = prisma.motocicleta.findUnique({
        where: {
            id: id_moto as string
        }
    });
    if (!moto) {
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
    const motoData = await moto;
    if (!motoData) {
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
                acc[key] = motoData[key as keyof typeof motoData] || '';
            }
            else if (propiedad.type === 'number' && key === 'anio') {
                const value = new Date("01-01-"+"" + motoData[key as keyof typeof motoData])
                acc[key] = value 
            }
            else if (propiedad.type === 'number' && key !== 'anio') {
                acc[key] = motoData[key as keyof typeof motoData] || 0;
            }
            else if (propiedad.type === 'boolean') {
                acc[key] = motoData[key as keyof typeof motoData] || false;
            }
            else if (propiedad.type === 'array') {
                acc[key] = motoData[key as keyof typeof motoData] || [];
            }
            else if (propiedad.type === 'object') {
                acc[key] = motoData[key as keyof typeof motoData] || {};
            }
            else {
                acc[key] = motoData[key as keyof typeof motoData] || null;
            }
            return acc;
        }, {});


        console.log("Valores iniciales de la moto:", valoresIniciales);
        

    return (

        <div className="flex justify-content-center">
            <FormComponent modo="editar" esquema={esquemaMoto} valoresIniciales={
                valoresIniciales}
                tipoCreacion={"motocicleta"}

            />
            {/* <FormComponent modo="editar
            " /> */}
        </div>
    );

}
