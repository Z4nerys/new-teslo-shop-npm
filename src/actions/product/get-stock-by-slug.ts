'use server'

import prisma from '../../lib/prisma';

export const getStockBySlug = async ( slug: string ) => {

    try {
        
        const product = await prisma.product.findFirst({
            where: {
                slug
            }
        })

        if ( !product ) return null

        return product.inStock
        
    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener producto por slug')
    }

}