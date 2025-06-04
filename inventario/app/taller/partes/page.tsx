import { eliminarParte, obtenerEsquemaParteEditar, obtenerTodasLasPartes } from "@/actions/partes/crud";
import { VehiculosTabla } from "@/components/vehiculos/TablaGeneral";

export default async function PartesPageServer() {
    //getData
    const motos = await obtenerTodasLasPartes() 

    if (motos === null) {
        return (
            <div className="flex justify-content-center">
                <div className="card">
                    <h2>No hay partes disponibles</h2>
                    <p>Por favor, crea una parte para comenzar.</p>
                    <button className="p-button p-component p-button-outlined">
                        <span className="p-button-icon pi pi-plus"></span>
                        <a href="/taller/partes/crear">
                            <span className="p-button-label">Crear Parte</span>
                        </a>
                    </button>
                </div>
            </div>
        );
    }
    

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