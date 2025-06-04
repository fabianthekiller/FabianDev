import { obtenerEsquemaServicioEditar, obtenerTodosLosServicios } from "@/actions/servicios/crud";
import { VehiculosTabla } from "@/components/vehiculos/TablaGeneral";

export default async function ServiciosPageServer() {
    const servicios = await obtenerTodosLosServicios() !== null ? await obtenerTodosLosServicios() : [];

    const esquemaGen = await obtenerEsquemaServicioEditar();


    const esquemaParseado = typeof esquemaGen === 'string' ? JSON.parse(esquemaGen) : esquemaGen;

    const tipoCreacion = esquemaParseado.title;

    const keys = Object.keys(esquemaParseado.properties);



    return (
        <div className="card flex justify-content-center">
            <VehiculosTabla unidades={JSON.stringify(servicios)} esquema={esquemaParseado} keys={keys} Tipo={
                "servicios"}
                crearRuta="/taller/servicios/crear"
                editarRuta="/taller/servicios/editar"
            />

        </div>
    );
}