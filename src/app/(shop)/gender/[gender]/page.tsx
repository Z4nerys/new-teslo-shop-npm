import { notFound, redirect } from "next/navigation";
import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { initialData } from "@/seed/seed";
import { Gender } from "@prisma/client";

interface Props {
  params: {
    gender: Gender;
  },
  searchParams: {
    page?: string;
  }
}

export default async function ({ params, searchParams }: Props) {

  const { gender } = params;
  /* if( id === 'kid') {
      notFound();
    } */

  const page = searchParams.page ? parseInt(searchParams.page) : 1

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    gender
    })

  if (products.length === 0) {
    redirect(`/gender/${gender}`);
  }

  const labels: Record<string, string> = {
    'men': 'para Hombres',
    'women': 'para Mujeres',
    'kid': 'para Niños',
    'unisex': 'para todos'
  }

  return (
    <>
      <Title
        title={`Articulos ${labels[gender]}`}
        subtitle={`Productos ${labels[gender]}`}
        className="mb-2"
      />
      <ProductGrid
        products={products}
      />

      <Pagination totalPages={totalPages}/>
    </>
  )
}
