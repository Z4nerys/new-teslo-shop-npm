/* export const revalidate = 604800 // 7 dias. aprox

import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

import { titleFont } from "@/config/fonts"
import { ProductSlideshow, StockLabel } from "@/components"
import { ProductMobileSlideshow } from "@/components/product/slideshow/ProductMobileSlideshow"
import { getProductBySlug } from "@/actions"
import { AddToCart } from "./ui/AddToCart" */

/* interface Props {
  params: {
    slug: string //slug xq asi se llama la ruta [slug], es lo que voy a recibir
  }
}
 */
/* export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = params.slug
 
  // fetch data
  const product = await getProductBySlug(slug)
 
  // optionally access and extend (rather than replace) parent metadata
  // esto es para acceder a los elementos del padre
  //const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: product?.title ?? 'Producto no encontrado',
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? 'Producto no encontrado',
      description: product?.description ?? '',
      //images: [], se recomienda todo el url "https://www.miweb.com/products/img/remera3.png" 
      images:[`/products/${product?.images[0]}`]
    },
  }
} */
/* 
export default async function ProductBySlugPage({ params }: Props) {

  const { slug } = params

  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="col-span-1 md:col-span-2">

        {/*Mobile Slideshow  *///}
        /*<ProductMobileSlideshow
          title={product.title}
          images={product.images}
          //hacer lo del className solo xq tiene nextImage
          className="block md:hidden"
        />

        {/* Desktop  Slideshow*///}
        /*<{ ProductSlideshow
          title={product.title}
          images={product.images}
          className="hidden md:block"
        />
      </div>
      <div className="col-span-1 px-5"> *///}
/* 
        <h1 className={`${titleFont.className} antialiased font-bold text-xl mb-2`}>
          {product.title}
        </h1>
        {/* si tengo que esperar que otros datos carguen, me conviene tenerlos a todos en un solo componente
        asi realizo una sola consulta a la db, mientras menos consulta mejor *///}
        /*<StockLabel slug={product.slug} />

        <p className="text-lg mb-5">${product.price}</p>

        <AddToCart product={product}/>

        {/* Descripcion *//*}
        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-light">{product.description}</p>
      </div>
      {/* Detalles *//*}
    </div>
  )
}
 */
export const revalidate = 604800; //7 días
import { Metadata, ResolvingMetadata } from "next";

import { notFound } from "next/navigation";

import { titleFont } from "@/config/fonts";
import {
  ProductMobileSlideshow,
  ProductSlideshow,
  StockLabel,
} from "@/components";
import { getProductBySlug } from "@/actions";
import { AddToCart } from './ui/AddToCart';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  // fetch data
  const product = await getProductBySlug(slug);

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []

  return {
    title: product?.title ?? "Producto no encontrado",
    description: product?.description ?? "",
    openGraph: {
      title: product?.title ?? "Producto no encontrado",
      description: product?.description ?? "",
      // images: [], // https://misitioweb.com/products/image.png
      images: [ `/products/${ product?.images[1] }`],
    },
  };
}

export default async function ProductBySlugPage({ params }: Props) {
  const { slug } = params;
  const product = await getProductBySlug(slug);
  console.log(product);

  if (!product) {
    notFound();
  }

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Slideshow */}
      <div className="col-span-1 md:col-span-2 ">
        {/* Mobile Slideshow */}
        <ProductMobileSlideshow
          title={product.title}
          images={product.images}
          className="block md:hidden"
        />

        {/* Desktop Slideshow */}
        <ProductSlideshow
          title={product.title}
          images={product.images}
          className="hidden md:block"
        />
      </div>

      {/* Detalles */}
      <div className="col-span-1 px-5">
        <StockLabel slug={product.slug} />

        <h1 className={` ${titleFont.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>

        <p className="text-lg mb-5">${product.price}</p>

        <AddToCart product={ product } />

        {/* Descripción */}
        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
}
