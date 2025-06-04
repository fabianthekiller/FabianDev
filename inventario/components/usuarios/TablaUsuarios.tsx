"use client";

import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

const TablaUsuarios = ({ usuarios }: { usuarios: any[] }) => {

    const [usuariosState, setUsuariosState] = useState(usuarios);
    const router = useRouter();

    


    return (
        <div className="card flex justify-content-center">

            <DataTable
                header={
                    () => (
                        <div className="flex justify-content-between">
                            
                            <Button label="Nuevo Usuario"
                                icon="pi pi-plus"
                                className="p-button-success"
                                onClick={() => {
                                    router.push("/usuarios/crear");
                                }} />
                            <h5 className="m-0">Usuarios</h5>
                            
                            <span className="p-input-icon-left">
                                <InputText placeholder="Buscar por nombre o email" 
                                    onChange={(e) => {
                                        const value = e.target.value.toLowerCase();
                                        const filteredUsuarios = usuarios.filter(usuario =>
                                            usuario.name.toLowerCase().includes(value) ||
                                            usuario.email.toLowerCase().includes(value)
                                        );
                                        setUsuariosState(filteredUsuarios);
                                    }} />   
                            </span>
                        </div>
                    )


                }

                value={usuarios}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                stripedRows
                showGridlines
                tableStyle={{ minWidth: '50rem' }}
                >

                <Column field="id" header="ID" hidden={true} sortable />
                <Column field="name" header="Nombre" sortable />
                <Column field="email" header="Email" sortable />
                <Column field="is_admin" header="Administrador" sortable />
                <Column field="is_mecanico" header="Mecánico" sortable />
                <Column field="createdAt" header="Creado" sortable
                    body={(rowData) => new Date(rowData.createdAt).toLocaleDateString("es-ES", {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    })} />

                <Column field="updatedAt" header="Actualizado" sortable
                    body={(rowData) => new Date(rowData.updatedAt).toLocaleDateString("es-ES", {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    })} />
                <Column field="isActive" header="Activo" sortable body={(rowData) => rowData.isActive ? "Sí" : "No"} />
                <Column field="image" header="Imagen" body={(rowData) => rowData.image ? <img src={rowData.image} alt={rowData.name} className="w-10 h-10 rounded-full" /> : "Sin imagen"} />


                </DataTable>


        </div>
    );

}

export default TablaUsuarios;