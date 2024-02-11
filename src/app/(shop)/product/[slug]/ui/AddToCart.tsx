//esto se hace aca y no en un componente
//xq lo voy a usar solamente aca, no se va a reutilizar
//es solamente para esta funcionalidad del carrito

'use client';
//xq meto estos aca?
//los meto aca xq necesito que se renderizen del lado del cliente
//cada vez que algo cambie

import { useState } from "react";

import { QuantitySelector, SizeSelector } from "@/components"
import { Product, Size } from "@/interfaces"
import { IoWarningOutline } from "react-icons/io5";


interface Props {
    product: Product
}

export const AddToCart = ({ product }: Props) => {

    const [size, setSize] = useState<Size | undefined>();
    const [quantity, setQuantity] = useState<number>(1)
    const [posted, setposted] = useState(false)

    const addToCart = () => {
        setposted(true)
        if (!size) return
        console.log({ quantity, size })
    }

    return (
        <>
            {
                posted && !size && (
                    <div className="flex bg-red-500 text-white rounded-md shadow-md px-4 py-2 fade-in items-center">
                        <div>Debe de seleccionar una talla*</div>
                        <div className="ml-auto"><IoWarningOutline size={25} /></div>
                    </div>
                )
            }
            {/* Selector de tallas */}
            <SizeSelector
                selectedSize={size}
                availableSizes={product.sizes}
                onSizeChanged={setSize}
            />

            {/* Selector de cantidad */}
            <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />

            {/* Button */}
            <button
                onClick={addToCart}
                className="btn-primary my-5"
            >
                Agregar al carrito
            </button>
        </>
    )
}