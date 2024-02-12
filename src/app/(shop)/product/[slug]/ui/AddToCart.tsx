//esto se hace aca y no en un componente
//xq lo voy a usar solamente aca, no se va a reutilizar
//es solamente para esta funcionalidad del carrito

'use client';
//xq meto estos aca?
//los meto aca xq necesito que se renderizen del lado del cliente
//cada vez que algo cambie

import { useState } from "react";

import { QuantitySelector, SizeSelector } from "@/components"
import { CartProduct, Product, Size } from "@/interfaces"
import { IoCheckmarkCircleOutline, IoWarningOutline } from "react-icons/io5";
import { useCartStore } from "@/store";


interface Props {
    product: Product
}

export const AddToCart = ({ product }: Props) => {

    const addProductToCart = useCartStore(state => state.addProductToCart)

    const [size, setSize] = useState<Size | undefined>();
    const [quantity, setQuantity] = useState<number>(1)
    const [posted, setPosted] = useState(false)

    const addToCart = () => {
        setPosted(true)

        if (!size) return

        const cartProduct: CartProduct = {
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            quantity: quantity,
            size: size,
            image: product.images[0]
        }

        addProductToCart(cartProduct);
        setTimeout(() => {
            setPosted(false);
        }, 3000);
        setQuantity(1)
        setSize(undefined)

    }

    return (
        <>
            {
                posted && !size && (
                    <div className="flex bg-red-500 text-white rounded-md shadow-md px-4 py-2 fade-in items-center">
                        <div>Seleccione una talla.</div>
                        <div className="ml-auto"><IoWarningOutline size={25} /></div>
                    </div>
                )
            }
            {/* {
                NOTIFICACION DE QUE SE AGREGO AL CARRITO
                posted && size && (
                    <div className="flex bg-green-500 text-white rounded-md shadow-md px-4 py-2 fade-in items-center">
                        <div>Agregado al carrito.</div>
                        <div className="ml-auto"><IoCheckmarkCircleOutline size={25} /></div>
                    </div>
                )
            } */}
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