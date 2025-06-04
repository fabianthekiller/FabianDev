import { eliminarParte, obtenerEsquemaParteEditar, obtenerTodasLasPartes } from "@/actions/partes/crud";
import { VehiculosTabla } from "@/components/vehiculos/TablaGeneral";

export default async function PartesPageServer() {
    //getData
    const motos = await obtenerTodasLasPartes() !== null ? await obtenerTodasLasPartes() : [];

    const esquemaParte = await obtenerEsquemaParteEditar();


    const esquemaParseado = typeof esquemaParte === 'string' ? JSON.parse(esquemaParte) : esquemaParte;

    const tipoCreacion = esquemaParseado.title;

    const keys = Object.keys(esquemaParseado.properties);



    return (
        <div className="card flex justify-content-center">
            <VehiculosTabla unidades={JSON.stringify(motos)} esquema={esquemaParseado} keys={keys} Tipo={
                "partes"}
                crearRuta="/taller/partes/crear"
                editarRuta="/taller/partes/editar"
                eliminarFCN={eliminarParte}
            />

        </div>
    );
}