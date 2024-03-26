'use client'

import { useEffect, useState } from "react"

import Link from "next/link"

import { useCartStore } from "@/store"
import { ProductImage, QuantitySelector } from "@/components"

export const ProductsInCart = () => {

    const [loaded, setLoaded] = useState(false)
    const productsInCart = useCartStore(state => state.cart)
    const updateProductQuantity = useCartStore(state => state.updateProductQuantity)
    const removeProduct = useCartStore(state => state.removeProduct)

    useEffect(() => {
      setLoaded(true)
    }, [])
    

    if(!loaded){
        return <p>Loading...</p>
    }

    return (
        <>
            {
                productsInCart.map(product => (
                    <div key={`${product.slug}-${product.size}`} className="flex mb-5">
                        <ProductImage
                            src={product.image}
                            width={100}
                            height={100}
                            style={{
                                width: '100px',
                                height: '100px'
                            }}
                            alt={product.title}
                            className="mr-5 rounded"
                        />

                        <div>
                            <Link
                                className="hover:text-blue-600" 
                                href={`/product/${product.slug}`}>
                                    {product.size} - {product.title}
                            </Link>
                            <p>${product.price}</p>
                            <QuantitySelector
                                quantity={product.quantity}
                                onQuantityChanged={ quantity => updateProductQuantity(product, quantity)}
                             />

                            <button className="underline mt-3"
                                onClick={() => removeProduct(product)}
                                >
                                Remover
                            </button>
                        </div>

                    </div>
                ))
            }
        </>
    )
}
