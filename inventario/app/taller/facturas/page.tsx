import FacturaCMP from "@/components/facturas/facturaCMP";

export default async function FacturasPageServer() {
    return (
        <div className="card flex justify-content-center">
            <FacturaCMP />
        </div>
    );
}