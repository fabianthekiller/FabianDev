import { crearParte, obtenerEsquemaParteCrear } from "@/actions/partes/crud";
import { obtenerEsquemaReparacionCrear } from "@/actions/reparacion/crud";
import FormComponent from "@/components/formComponent";
import { Card } from "primereact/card";




export default async function ReparacionCrearPage() {

    const esquemaTipo = await obtenerEsquemaReparacionCrear();


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

    const crearFCN = async (data : any) => {
        "use server"
        const res =  await crearParte(data);

        return res;
    }

    const editarFCN = async (data : any) => {
        "use server"
        console.log("data", data);
        const res  = await crearParte(data)

        console.log("res", res);

        if (res) {
            alert("Parte editado correctamente");
        }
        else {
            alert("Error al editar parte");
        }
    }

    return (

        <div className="flex justify-content-center">
            <FormComponent modo="crear" esquema={esquemaTipo} valoresIniciales={
                valoresIniciales}
                tipoCreacion={"reparaciones"}
                crearFCN={crearFCN}
                editarFCN={
                    editarFCN
                }
                />
            {/* <FormComponent modo="editar
            " /> */}
        </div>
    );

}
