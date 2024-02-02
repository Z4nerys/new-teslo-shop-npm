'use server';

import prisma from "@/lib/prisma";

export const getPaginatedProductsWithImages = async () => {

    try {
        const products = await prisma.product.findMany({
            include: {
                ProductImage: { // incluya ProductImage y del productImage
                    take: 2, // solo 2 images
                    select: { //selecciono solo la url
                        url: true
                    }
                }
            }
        })

        return {
            products: products.map(product => ({
                currentPage: 1,
                totalPages: 10,
                ...product,
                images: product.ProductImage.map(image => image.url)
            }))
        }

    } catch (error) {
        throw new Error("No se pudo cargar los productos")
    }
}