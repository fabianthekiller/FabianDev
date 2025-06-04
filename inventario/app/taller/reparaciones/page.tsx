import { obtenerEsquemaReparacionEditar, obtenerTodasLasReparaciones } from "@/actions/reparacion/crud";
import { VehiculosTabla } from "@/components/vehiculos/TablaGeneral";

export default async function ReparacionesPageServer() {
    //getData
    const motos = await obtenerTodasLasReparaciones() !== null ? await obtenerTodasLasReparaciones() : [];

    const esquemaParte = await obtenerEsquemaReparacionEditar();


    console.log("motos", motos);
    


    const esquemaParseado = typeof esquemaParte === 'string' ? JSON.parse(esquemaParte) : esquemaParte;

    const tipoCreacion = esquemaParseado.title;

    const keys = Object.keys(esquemaParseado.properties);



    return (
        <div className="card flex justify-content-center">
            <VehiculosTabla unidades={JSON.stringify(motos)} esquema={esquemaParseado} keys={keys} Tipo={
                "reparaciones"}
                crearRuta="/taller/reparaciones/crear"
                editarRuta="/taller/reparaciones/editar"
                asignarRuta="/taller/reparaciones/asignarPartes"

            />

        </div>
    );
}