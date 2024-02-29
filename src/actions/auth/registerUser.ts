'use server'
import bcryptjs from 'bcryptjs';
import prisma from '@/lib/prisma';

export const registerUser = async (name: string, email: string, password: string) => {

    try {
        const user = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                password: bcryptjs.hashSync(password)
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        })
        return {
            ok: true,
            message: 'Usuario creado',
            user
        }
    } catch (error) {
        //console.log(error);
        return {
            ok: false,
            message: 'No se pudo crear el usuario',
            user: null
        }
    }

}