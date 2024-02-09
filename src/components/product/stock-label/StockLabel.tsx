'use client' // pongo use client xq quiero que cada vez que el
//usuario lo use, se haga la peticion.

import { useEffect } from "react";
import { titleFont } from "@/config/fonts"
import { getStockBySlug } from "@/actions";

interface Props {
    slug: string;
}


export const StockLabel = ({ slug }: Props) => {

    useEffect(() => {
        getStock()
    })

    const getStock = async () => {
        const stock = await getStockBySlug(slug)
        console.log({stock})
        return stock
    }

    return (
        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
            Stock: 150
        </h1>
    )
}
