import { obtenerEsquemaClienteEditar, obtenerTodosLosClientes } from "@/actions/cliente/crud";
import { VehiculosTabla } from "@/components/vehiculos/TablaGeneral";
import { inspect } from "util";

export default async function ClientePageServer() {
    //getData
    const clientes = await obtenerTodosLosClientes() !== null ? await obtenerTodosLosClientes() : [];





    const esquemaCliente = await obtenerEsquemaClienteEditar();


    const esquemaParseado = typeof esquemaCliente === 'string' ? JSON.parse(esquemaCliente) : esquemaCliente;

    const tipoCreacion = esquemaParseado.title;

    const keys = Object.keys(esquemaParseado.properties);



    

    return (
        <div className="card flex justify-content-center">
            <VehiculosTabla unidades={JSON.stringify(clientes)} esquema={esquemaParseado} keys={keys} Tipo={
                "clientes"}
                crearRuta="/taller/clientes/crear"
                editarRuta="/taller/clientes/editar"
                asignarRuta="/taller/clientes/asignar"

            />

        </div>
    );
}

