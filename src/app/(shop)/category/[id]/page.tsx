import { ProductGrid, Title } from "@/components";
import { Category } from "@/interfaces";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: Category;
  }
}

const seedProducts = initialData.products

export default function ({ params }: Props) {
  
  const { id } = params;
  
  /* if( id === 'kid') {
    notFound();
  } */

  const products = seedProducts.filter(product => product.gender === id)

  const labels: Record<Category, string> = {
    'men': 'para Hombres',
    'women': 'para Mujeres',
    'kid': 'para Niños',
    'unisex': 'para todos'
  }

  return (
    <>
      <Title 
        title={`Articulos ${labels[id]}`}
        subtitle={`Productos ${labels[id]}`}
        className="mb-2"
      />
      <ProductGrid
        products={ products }
      />
    </>
  )
}
