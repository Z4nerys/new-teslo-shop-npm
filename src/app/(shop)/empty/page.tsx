import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";

export default function () {
    return (

      /* justify-center centro del eje x, items-center, centro del eje y */
      <div className="flex justify-center items-center h-[800px]">
          <IoCartOutline size={ 80 } className="mx-5"/>

          <div className="flex flex-col items-center">
            <h1 className="text-xl font-semibold">
              Tu Carrito está vacío
            </h1>
            <Link
              href='/'
              className="text-blue-500 mt-2 text-4xl"
            >
              Regresar
            </Link>
          </div>

      </div>
    )
  }
  