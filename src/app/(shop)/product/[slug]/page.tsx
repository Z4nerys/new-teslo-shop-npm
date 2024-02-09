export const revalidate = 604800 // 7 dias. aprox

import { notFound } from "next/navigation"

import { titleFont } from "@/config/fonts"
import { ProductSlideshow, QuantitySelector, SizeSelector, StockLabel } from "@/components"
import { ProductMobileSlideshow } from "@/components/product/slideshow/ProductMobileSlideshow"
import { getProductBySlug } from "@/actions"

interface Props {
  params: {
    slug: string //slug xq asi se llama la ruta [slug], es lo que voy a recibir
  }
}

export default async function ProductBySlugPage({ params }: Props) {

  const { slug } = params

  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="col-span-1 md:col-span-2">

        {/*Mobile Slideshow  */}
        <ProductMobileSlideshow
          title={product.title}
          images={product.images}
          //hacer lo del className solo xq tiene nextImage
          className="block md:hidden"
        />

        {/* Desltop  Slideshow*/}
        <ProductSlideshow
          title={product.title}
          images={product.images}
          className="hidden md:block"
        />
      </div>
      <div className="col-span-1 px-5">

        <StockLabel slug={product.slug} />
        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>

        <p className="text-lg mb-5">${product.price}</p>

        <SizeSelector
          selectedSize={product.sizes[0]}
          availableSizes={product.sizes}
        />

        <QuantitySelector
          quantity={2}
        />

        {/* Button */}

        <button className="btn-primary my-5">
          Agregar al carrito
        </button>

        {/* Descripcion */}
        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-light">{product.description}</p>
      </div>
      {/* Detalles */}
    </div>
  )
}
