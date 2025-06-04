import { obtenerEsquemaMoto, obtenerTodasLasMotos } from "@/actions/motocicleta/crud";
import { VehiculosTabla } from "@/components/vehiculos/TablaGeneral";

export default async function VehiculosPageServer() {

    //getData
    const motos = await obtenerTodasLasMotos() !== null ? await obtenerTodasLasMotos() : [];

    const esquemaMoto = await obtenerEsquemaMoto();


    const esquemaParseado = typeof esquemaMoto === 'string' ? JSON.parse(esquemaMoto) : esquemaMoto;

    const tipoCreacion = esquemaParseado.title;

    const keys = Object.keys(esquemaParseado.properties);

    return (
        <div className="card flex justify-content-center">
            <VehiculosTabla unidades={JSON.stringify(motos)} esquema={esquemaParseado} keys={keys} Tipo={
            "motocicletas"}
            crearRuta="/taller/motocicletas/crear"
            editarRuta="/taller/motocicletas/editar"
            />
            
        </div>
    );
}