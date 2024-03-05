'use server'
import prisma from '@/lib/prisma';

export const deleteUserAddress = async (userId: string) => {
    try {

        await prisma.userAddress.delete({ where: { userId } })

        return { ok: true }

    } catch (error) {
        console.log(error)
        //este if es xq tira error si no hay nada guardado y quiere eliminar
        //(error as any) esto es para eliminar el warning de que no existe la propiedad
        if((error as any).meta?.cause === 'Record to delete does not exist.') return true

        return {
            ok: false,
            message: 'No se pudo eliminar la dirección'
        }
    }
}