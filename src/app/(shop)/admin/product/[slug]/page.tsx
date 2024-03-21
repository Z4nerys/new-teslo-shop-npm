'use server'
//las paginas se generan del lado del servidor
//
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";
import { getCategories, getProductBySlug } from "@/actions";

interface Props {
    params: {
        slug: string;
    }
}

export default async function ProductPage({ params }: Props) {

    const { slug } = params

    /* //Hago las 2 a la vez xq no son dependientes, una de otra 
    const product = await getProductBySlug(slug)
    const categories = await getCategories() 
    */

    const [product, categories] = await Promise.all([
        getProductBySlug(slug),
        getCategories()
    ])

    // todo: new
    if (!product) {
        redirect('/admin/products')
    }


    const title = (slug === 'new') ? 'Nuevo producto' : 'Editar producto'

    return (
        <>
            <Title title={title} />
            <ProductForm product={product} categories={categories} />
        </>
    )
}
