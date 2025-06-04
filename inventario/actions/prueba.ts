"use server";

export async function prueba() {
    // traer datos de una API externa

    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) {
        throw new Error('Error al obtener los datos de la API');
    }
    const data = await response.json();
    return data;
}
