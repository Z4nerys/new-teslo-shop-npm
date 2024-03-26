'use server'

import prisma from '../../lib/prisma';

export const getProductBySlug = async ( slug: string ) => {

    try {
        const product = await prisma.product.findFirst({
            include: {
                ProductImage: true
            },
            where: {
                slug
            }
        })

        if ( !product ) return null

        return {
            ...product,
            images: product.ProductImage.map( image => image.url),
            //ProductImage: [ { url: '8765120-00-A_0_2000.jpg' }, { url: '8765120-00-A_1.jpg' } ]. lo que hago aca es una conversion:
            //para acceder diferente a las imagenes.
            //images: [ '1740290-00-A_0_2000.jpg', '1740290-00-A_1.jpg' ]
        }       
    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener producto por slug')
    }

}