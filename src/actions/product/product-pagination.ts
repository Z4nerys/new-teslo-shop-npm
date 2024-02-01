'use server';

import prisma from "@/lib/prisma";

export const getPaginatedProductsWithImages = async() => {

    try {
        const products = await prisma.product.findMany({
            include:{
                ProductImage: { // incluya ProductImage y del productImage
                    take: 2, // solo 2 images
                    select: { //selecciono solo la url
                        url: true
                    }
                }
            }
        })
        
        console.log(products)

    } catch (error) {
        
    }


}