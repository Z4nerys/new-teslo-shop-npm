'use client'

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation';
import Link from "next/link"

import { useCartStore } from "@/store"
import { currencyFormat } from '../../../../utils';

export const OrderSummary = () => {
    const router = useRouter();

    const [loaded, setLoaded] = useState(false)

    const { itemsInCart, subTotal, tax, total } = useCartStore(state => state.getSummaryInformation())
    
    useEffect(() => {
        setLoaded(true)
    }, [])

    useEffect(() => {

        if ( itemsInCart === 0 && loaded === true )   {
          router.replace('/empty')
        }
    
      },[ itemsInCart, loaded, router ])

    if (!loaded) return <p>Loading...</p>

    return (
        <>
            <div className="grid grid-cols-2">
                <span>Nro. Productos</span>
                <span className="text-right">{itemsInCart === 1 ? '1 articulo' : `${itemsInCart} articulos`}</span>

                <span>Subtotal</span>
                <span className="text-right">{currencyFormat(subTotal)}</span>

                <span>Impuestos (15%)</span>
                <span className="text-right">{currencyFormat(tax)}</span>

                <span className="mt-5 text-2xl">Total:</span>
                <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>

            </div>
            <div className="mt-5 mb-2 w-full">
                <Link
                    className="flex btn-primary justify-center"
                    href="/checkout/address">
                    Checkout
                </Link>
            </div>
        </>
    )
}
