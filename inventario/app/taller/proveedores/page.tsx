import { obtenerEsquemaProveedorEditar, obtenerTodosLosProveedores } from "@/actions/proveedores/crud";
import { VehiculosTabla } from "@/components/vehiculos/TablaGeneral";

export default async function ProveedoresPageServer() {
    //getData
    const motos = await obtenerTodosLosProveedores() !== null ? await obtenerTodosLosProveedores() : [];

    const esquemaParte = await obtenerEsquemaProveedorEditar();


    const esquemaParseado = typeof esquemaParte === 'string' ? JSON.parse(esquemaParte) : esquemaParte;

    const tipoCreacion = esquemaParseado.title;

    const keys = Object.keys(esquemaParseado.properties);



    return (
        <div className="card flex justify-content-center">
            <VehiculosTabla unidades={JSON.stringify(motos)} esquema={esquemaParseado} keys={keys} Tipo={
                "proveedores"}
                crearRuta="/taller/proveedores/crear"
                editarRuta="/taller/proveedores/editar"
            />

        </div>
    );
}