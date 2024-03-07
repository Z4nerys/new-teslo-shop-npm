'use server'

import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import prisma from '@/lib/prisma';

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {

    const session = await auth();

    const userId = session?.user.id

    //verificar sesion de usuario

    if (!userId) {
        return {
            ok: false,
            message: 'No hay sesión de usuario'
        }
    }
    //console.log({ productIds, address, userId })

    //obtener la informacion de los productos
    //Nota: podemos llevar 2 productos o mas con el mismo ID

    //estos son los productos que tengo en la db
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds.map(p => p.productId)
            }
        }
    })

    //calcular los montos // encabezado
    const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0)
    //productsIds son los que tengo del lado de cliente, los que me llegan

    //los totales de tax, subtotal y total
    const { subTotal, tax, total } = productIds.reduce((totals, item) => {
        const productQuantity = item.quantity
        const product = products.find(product => product.id === item.productId)

        if (!product) throw new Error(`${item.productId} no existe - 500`)

        const subTotal = product.price * productQuantity

        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15; //se podria leer de .env 
        totals.total += subTotal * 1.15;

        return totals

    }, { subTotal: 0, tax: 0, total: 0 })

    //crear la transacción de base de datos

    try {
        //la transaccion lo que tiene es que si lanza un error
        //se revierten todos los cambios
        //si llega al final hace un commit de los cambios
        const prismaTx = await prisma.$transaction(async (tx) => {

            //1. Actualizar el stock de los productos
            const updatedProductsPromises = products.map((product) => {

                //acumular los cantidades de los productos
                const productQuantity = productIds.filter(
                    p => p.productId === product.id
                ).reduce((acc, item) => item.quantity + acc, 0);

                if (productQuantity === 0) {
                    throw new Error(`${product.id}, no tiene cantidad definida`)
                }
                return tx.product.update({
                    where: { id: product.id },
                    data: {
                        //inStock: product.inStock - productQuantity//esto no se hace xq el product.inStock tiene un valor viejo
                        inStock: {
                            decrement: productQuantity
                            //este si xq estoy viendo el valor actual del producto
                        }
                    }
                })
            })

            const updatedProducts = await Promise.all(updatedProductsPromises)
            //verificar valores negativos en la existencia = no hay stock
            updatedProducts.forEach(product => {
                if (product.inStock < 0) {
                    throw new Error(`${product.title} no tiene inventario suficiente`)
                }
            })

            //2. Crear la orden - Encabezado - Detalles
            const order = await tx.order.create({
                data: {
                    userId,
                    itemsInOrder,
                    subTotal,
                    tax,
                    total,
                    OrderItem: {
                        createMany: {
                            data: productIds.map(p => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: products.find(product => product.id === p.productId)?.price ?? 0
                            }))
                        }
                    }
                }
            })
            //Validar, si el price es cero, entonces lanzar un error
            //entonces los cambios no impactan en la db xq el transacction 

            //3. Crear la direccion de la orden
            const orderAddress = await tx.orderAddress.create({
                data: {
                    firstName: address.firstName,
                    lastName: address.lastName,
                    address: address.address,
                    address2: address.address2,
                    postalCode: address.postalCode,
                    city: address.city,
                    phone: address.phone,
                    countryId: address.country,
                    orderId: order.id
                }
            })

            return {
                order,
                updatedProducts,
                orderAddress
            }
        })

        return {
            ok: true,
            order: prismaTx.order,
            prismaTx
        }

    } catch (error: any) {
        return {
            ok: false,
            message: error?.message
        }
    }
}