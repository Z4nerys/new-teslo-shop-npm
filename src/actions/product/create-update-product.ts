'use server'

//otra forma de hacer las cosas, es este action server
import { Gender, Product, Size } from '@prisma/client';
import { z } from 'zod' //esquema de validacion
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config(process.env.CLOUDINARY_URL ?? '')

//tengo que hacer una interfaz
//fernando uso el de primsa para no hacer mas codigo
//pero no es recomendable el de prisma

const productSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string(),
    price: z.coerce
        .number()
        .min(0)
        .transform(val => Number(val.toFixed(2))),
    inStock: z.coerce
        .number()
        .min(0)
        .transform(val => Number(val.toFixed(0))),
    categoryId: z.string().uuid(),
    sizes: z.coerce.string().transform(val => val.split(',')),
    tags: z.string(),
    gender: z.nativeEnum(Gender)
})


export const createUpdateProduct = async (formData: FormData) => {
    const data = Object.fromEntries(formData)

    const productParsed = productSchema.safeParse(data)
    if (!productParsed.success) {
        console.log(productParsed.error)
        return { ok: false }
    }
    const product = productParsed.data

    product.slug = product.slug.toLowerCase().replace(/ /g, '-')

    const { id, ...rest } = product

    try {
        const prismaTx = await prisma.$transaction(async (tx) => {

            let product: Product
            const tagsArray = rest.tags.split(',').map(tag => tag.trim().toLowerCase());

            if (id) {
                //actualizar
                product = await prisma.product.update({
                    where: { id },
                    data: {
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[],
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                })

            } else {
                //Crear
                product = await prisma.product.create({
                    data: {
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[]
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                })
            }

            if (formData.getAll('images')) {
                const images = await uploadImages(formData.getAll('images') as File[])
                if( !images ) {
                    throw new Error('No se pudo cargar las imágenes, rollingback')
                    //es necesario el trhow para que la transaccion se cancele
                }
                //actualizar imagenes
                await prisma.productImage.createMany({
                    data: images.map( image => ({
                        url: image!,
                        productId: product.id
                    }))
                })
            }

            return {
                product
            }
        })

        // Todo: revalidate path
        revalidatePath('/admin/products')
        revalidatePath(`/admin/product/${product.slug}`)
        revalidatePath(`/product/${product.slug}`)

        return {
            ok: true,
            product: prismaTx.product
        }

    } catch (error) {
        return {
            ok: false,
            message: 'Revisar logs, no se pudo actualizar'
        }
    }
}

const uploadImages = async (images: File[]) => {

    try {
        const uploadPromises = images.map(async (image) => {
            try {
                const buffer = await image.arrayBuffer();
                const base64Image = Buffer.from(buffer).toString('base64')
                return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`, {
                    //folder: 'Home'
                    //esto es para mandarlo dentro de una carpeta
                })
                    .then(r => r.secure_url) //se usa el .then para que todas las promesas se
                //resuelvan al mismo tiempo, con el await se harian una x una. y no queremos eso aca

            } catch (error) {
                console.log(error)
                return null
            }
        })

        const uploadedImages = await Promise.all(uploadPromises)
        const isNull = uploadedImages.some( value => value === null)
        if(isNull) return null
        return uploadedImages
    } catch (error) {
        console.log(error)
        return null
    }
}