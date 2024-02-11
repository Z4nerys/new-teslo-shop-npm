import type { Size } from "@/interfaces"
import clsx from "clsx";
//si importo una interfaz le puedo poner type para que
//lo ignore en tiempo de transpilacion

interface Props {
    selectedSize?: Size;
    availableSizes: Size[]; // ['SX', 'M', 'XL', 'XXL']

    onSizeChanged: (size: Size) => void
}


export const SizeSelector = ({ selectedSize, availableSizes, onSizeChanged }: Props) => {
  
    return (
    <div className="my-5">
        <h3 className="font-bold mb-4">Tallas Disponibles</h3>

        <div className="flex">
            {
                availableSizes.map(size => (
                    <button
                        key={size}
                        onClick={ () => onSizeChanged(size) }
                        className={
                            clsx(
                                "mx-2 hover:underline hover:text-blue-600 text-lg", {
                                    'underline text-blue-600': size === selectedSize
                                }
                                )
                        }
                    >
                        {size}
                    </button>
                ))
            }
        </div>
    </div>
  )
}
