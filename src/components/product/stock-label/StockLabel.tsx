'use client' // pongo use client xq quiero que cada vez que el
//usuario lo use, se haga la peticion.

import { useEffect, useState } from "react";
import { titleFont } from "@/config/fonts"
import { getStockBySlug } from "@/actions";

interface Props {
    slug: string;
}


export const StockLabel = ({ slug }: Props) => {

    const [stock, setStock] = useState(0)
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        getStock()
    })

    const getStock = async () => {
        const inStock = await getStockBySlug(slug)
        setStock(inStock)
        setIsLoading(false)
    }

    return (
        <>
            {
                isLoading ? (
                    <h1 className={`bg-gray-300 animate-pulse fade-in`}>
                        &nbsp;
                    </h1>
                ) : (
                    <h1 className={`${titleFont.className} antialiased font-bold text-md fade-in`}>
                        Stock: {stock}
                    </h1>
                )
            }
        </>
    )
}
