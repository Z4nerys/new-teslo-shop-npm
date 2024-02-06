'use server';

import prisma from "@/lib/prisma";
import { Gender } from "@prisma/client";

interface PaginationOptions {
    page?: number;
    take?: number;
    gender?: Gender;
}

export const getPaginatedProductsWithImages = async ({
    page = 1,
    take = 12,
    gender
}: PaginationOptions) => {
    if (isNaN(Number(page))) page = 1
    if (page < 1) page = 1

    try {
        // 1. obtener los productos
        const [products, totalCount] = await Promise.all([
            prisma.product.findMany({
                take: take, // La cantidad que quiero traer.
                skip: (page - 1) * take, // Cantidad que saltea, si es 0 trae desde el primero. Si es 5, trae desde el 6, etc.
                // Por ejemplo, si page = 2, entonces skip = (2 - 1) * 12 = 1 * 12 = se saltea 12 y trae desde el 13.
                include: {
                    ProductImage: { // Incluye ProductImage y selecciona solo la url.
                        select: {
                            url: true
                        }
                    }
                },
                where: {
                    gender
                }
            }),

            // 2. Obtener el total de productos.
            prisma.product.count({
                where: {
                    gender
                }
            })
        ]);

        const totalPages = Math.ceil(totalCount / take)

        return {
            currentPage: page,
            totalPages: totalPages,
            products: products.map(product => ({
                ...product,
                images: product.ProductImage.map(image => image.url)
            }))
        }

    } catch (error) {
        throw new Error("No se pudo cargar los productos")
    }
}