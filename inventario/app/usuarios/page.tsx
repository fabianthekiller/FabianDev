import { getUsersfromDb } from "@/actions/usuarios/crud";
import TablaUsuarios from "@/components/usuarios/TablaUsuarios";
import { auth } from "@/auth";
import { Card } from "primereact/card";




export default async function UsersPageServer() {
    const usuarios = await getUsersfromDb();

    const session = await auth();

    const is_admin = usuarios.filter((user) => user.email === session?.user?.email && user.is_admin)[0];

    
    


    if (!is_admin) {
        return (
            <div className="flex align-items-center justify-content-center min-h-screen">
                <Card className="w-25rem shadow-4">
                    <div className="flex flex-column align-items-center text-center">
                        <i className="pi pi-ban text-6xl text-red-500 mb-4"></i>
                        <h1 className="text-4xl font-bold text-900 mb-2">Acceso Denegado</h1>
                        <p className="text-700 line-height-3">No tienes permisos para ver esta página.</p>
                    </div>
                </Card>
            </div>
        );
    }



    return (
        <TablaUsuarios usuarios={usuarios} />
    );

}



