'use client'

import { useEffect, useState } from "react"

import Image from "next/image"

import { QuantitySelector } from "@/components"
import { useCartStore } from "@/store"
import Link from "next/link"

export const ProductsInCart = () => {

    const [loaded, setLoaded] = useState(false)
    const productsInCart = useCartStore(state => state.cart)

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
                        <Image
                            src={`/products/${product.image}`}
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
                                onQuantityChanged={ value => console.log(value)} 
                             />

                            <button className="underline mt-3">
                                Remover
                            </button>
                        </div>

                    </div>
                ))
            }
        </>
    )
}
