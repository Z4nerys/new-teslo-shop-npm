'use server'

import { auth } from "@/auth.config"
import prisma from '@/lib/prisma';
import { revalidatePath } from "next/cache";

export const changeUserRole = async (userId: string, role: string) => {

    const session = await auth()

    if(session?.user.role !== 'admin'){
        return{
            ok: false,
            message: 'Debe ser admin'
        }
    }

    try {
        //esto es x el tipado de prisma, permite esos 2 nada mas
        const newRole = role === 'admin' ? 'admin': 'user'

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                role: newRole
            }
        })
        //el revalidatePath es para que veamos
        //en pantalla reflejado los cambios 
        revalidatePath('/admin/users')
        return {
            ok: true
        }
        
    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: 'No se pudo actualizar el role'
        }
    }
}