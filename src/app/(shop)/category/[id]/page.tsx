import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  }
}

export default function ({ params }: Props) {

  const { id } = params;

  if( id === 'kids') {
    notFound();
  }

  return (
    <div>
      HACER EL 404 personalizado. video 193
      <h1>Category page {id}</h1>
    </div>
  )
}
