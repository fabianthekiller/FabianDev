import { obtenerEsquemaProveedorEditar } from "@/actions/proveedores/crud";
import FormComponent from "@/components/formComponent";
import { Card } from "primereact/card";




export default async function MotocicletaCrearPage() {

    const esquemaProveedor = await obtenerEsquemaProveedorEditar();


    const esquemaParseado = typeof esquemaProveedor === 'string' ? JSON.parse(esquemaProveedor) : esquemaProveedor;

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
            <FormComponent modo="crear" esquema={esquemaProveedor} valoresIniciales={
                valoresIniciales}
                tipoCreacion={"proveedor"} />
            {/* <FormComponent modo="editar
            " /> */}
        </div>
    );

}
