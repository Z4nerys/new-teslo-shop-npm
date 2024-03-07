'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAddressStore, useCartStore } from "@/store"
import { currencyFormat } from "@/utils"

import clsx from "clsx"
import { placeOrder } from "@/actions"

export const PlaceOrder = () => {

    const router = useRouter()

    const address = useAddressStore(state => state.address)
    const { itemsInCart, subTotal, tax, total } = useCartStore(state => state.getSummaryInformation())

    const [errorMessage, setErrorMessage] = useState('')

    //esto es para que no haga doble click en colocar orden.
    //para que no se cree repetida la orden
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)

    const cart = useCartStore(state => state.cart)
    const clearCart = useCartStore(state => state.clearCart)

    // esto es para que no haya discrepancia entre lo que se
    //renderiza del servidor y en el cliente
    //para que queden los 2 con los mismos datos
    //para problemas de hidratacion
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        setLoaded(true)
    }, [])

    const onPlaceOrder = async () => {
        setIsPlacingOrder(true)
        //await sleep(2)
        // Todo: Server action

        const productsToOrder = cart.map(product => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size
        }))

        //Server Action
        const resp = await placeOrder(productsToOrder, address)

        if (!resp.ok) {
            setIsPlacingOrder(false)
            setErrorMessage(resp.message)
            return
        }
        //si llego aca, todo salio bien!
        clearCart();
        router.replace(`/orders/${resp.order?.id}`)

        //validar cuando se vuelve para atras despues de navegar
        //validar: mientras espera cancelar el btn. "editar compra"
    }

    if (!loaded) {
        return <p>Cargando...</p>
    }


    return (
        <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl font-bold mb-2">Direccíon de entrega</h2>
            <div className="mb-6">
                <p className="text-xl">
                    {address.firstName} {address.lastName}
                </p>
                <p>{address.address}</p>
                <p>{address.address2}</p>
                <p>{address.postalCode}</p>
                <p>
                    {address.city}, {address.country}
                </p>
                <p>{address.phone}</p>
            </div>
            {/* DIvider */}
            <div
                className="w-full h-0.5 rounded bg-gray-200 mb-5"
            />

            <h2 className="text-2xl font-bold mb-2">Resumen de orden</h2>

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

                <div className="mb-5">
                    {/* Disclaimer */}
                    <p className="text-xs">
                        Al hacer click en &quot;Colocar orden&quot;, aceptas nuestros {" "}
                        <a href="#" className="underline">
                            términos y condiciones
                        </a>{" "}
                        y{" "}
                        <a href="#" className="underline">
                            politicas de privacidad
                        </a>
                        .
                    </p>
                </div>

                <p className="text-red-500">{errorMessage}</p>

                <button
                    //href="/orders/123"
                    disabled={isPlacingOrder}
                    onClick={onPlaceOrder}
                    className={
                        clsx('fade-in', {
                            'btn-primary': !isPlacingOrder,
                            'btn-disabled': isPlacingOrder
                        })
                    }
                >
                    Colocar orden
                </button>
            </div>

        </div>
    )
}
