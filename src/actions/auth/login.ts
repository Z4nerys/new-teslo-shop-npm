'use server'

import { signIn } from '@/auth.config';
import { sleep } from '@/utils/sleep';

// ...

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        console.log(formData)
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirect: false,
        });

        return 'Success'
    } catch (error) {
        console.log(error)
        if((error as any ).type === 'CredentialsSignin'){
            return 'CredentialsSignin'
        }
        return 'UnknownError'
    }
}

//otra forma de login que es mas sencilla

export const login = async(email: string, password: string) => {
    try {
        await signIn('credentials', {email, password})

        return { ok: true}
    } catch (error) {
        //usar un loguer aca
        console.log(error)
        return {
            ok: false,
            message: 'No se pudo iniciar sesión'
        }
    }
}