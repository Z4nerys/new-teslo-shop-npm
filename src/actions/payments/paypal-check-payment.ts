'use server'

import { PayPalOrderStatusResponse } from "@/interfaces"
import prisma from '@/lib/prisma';
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (paypalTransactionId: string) => {
    const authToken = await getPayPalBearerToken()
    if (!authToken) {
        return {
            ok: false,
            message: 'No se pudo obtener el token.'
        }
    }
    const respPayment = await verifyPayPalPayment(paypalTransactionId, authToken)
    if (!respPayment) {
        return {
            ok: false,
            message: 'Error al verificar el pago'
        }
    }
    const { status, purchase_units } = respPayment

    if (status !== 'COMPLETED') {
        return {
            ok: false,
            message: 'Aun no se ha pagado en PayPal'
        }
    }

    //Todo: Realizar actualizacion el la db
    
    const { invoice_id: orderId } = purchase_units[0]
    const check = await checkOrderAsPaid(orderId)
    if (!check) {
        return {
            ok: false,
            message: 'No se pudo actualizar el pago'
        }
    }
    //el revalidatePath es para que veamos
    //en pantalla reflejado los cambios 
    revalidatePath(`/orders/${orderId}`)

    return {
        ok: true
    }
}

const getPayPalBearerToken = async (): Promise<string | null> => {
    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET
    const oauth2Url = process.env.PAYPAL_OAUTH_URL || ''

    const base64Token = Buffer.from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
        'utf-8'
    ).toString("base64")

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append(
        "Authorization",
        `Basic ${base64Token}`
    );

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded
    };

    try {
        //puedo usar axios tmb, si me es mas comodo.
        const result = await fetch(oauth2Url, {
            ...requestOptions,
            cache: "no-store"   //nextjs, mantiene el cache y eso hacia que me devuelva un token no valido
            //asi que con esto hago que no haya cache, y que haga la peticion siempre.
        }).then(r => r.json());
        return result.access_token
    } catch (error) {
        console.log(error)
        return null
    }
}

const verifyPayPalPayment = async (paypalTransactionId: string, bearerToken: string): Promise<PayPalOrderStatusResponse | null> => {
    const paypalOrderUrl = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`

    const myHeaders = new Headers();
    myHeaders.append(
        "Authorization",
        `Bearer ${bearerToken}`
    );

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    try {
        const result = await fetch(paypalOrderUrl, {
            ...requestOptions,
            cache: "no-store"   //nextjs, mantiene el cache y eso hacia que me devuelva un token no valido
            //asi que con esto hago que no haya cache, y que haga la peticion siempre.
        }).then(r => r.json())
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

const checkOrderAsPaid = async (orderId: string): Promise<boolean> => {
    try {
        const update = await prisma.order.update({
            where: { id: orderId },
            data: {
                isPaid: true,
                paidAt: new Date()
            }
        })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}