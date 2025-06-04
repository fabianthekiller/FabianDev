"use server";


export async function signInfcn(username: string, password: string) {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/callback/credentials`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
            redirect: false,
        }),
    });

    const data = await res.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}
