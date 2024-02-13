import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartProduct } from "@/interfaces";

interface State {

    cart: CartProduct[];

    //metodos para modificar el carrito
    addProductToCart: (product: CartProduct) => void
    // updateProductQuantity
    // removeProduct
}

export const useCartStore = create<State>()(

    persist(
        (set, get) => ({
            cart: [],

            //metodos
            addProductToCart: (product: CartProduct) => {
                const { cart } = get()
                console.log(cart)
                //1. revisar si el producto con la talla seleccionada, existe
                const productInCart = cart.some(
                    (item) => (item.id === product.id && item.size === product.size)
                );

                if (!productInCart) {
                    set({ cart: [...cart, product] })
                    return
                }
                //2. el producto existe, entonces aumento la cantidad
                const updateCartProducts = cart.map(item => {
                    if (item.id === product.id && item.size === product.size) {
                        return { ...item, quantity: item.quantity + product.quantity }
                    }
                    return item
                })
                set({ cart: updateCartProducts })
            }
        }),
        
        {
            name: 'shopping-cart',
            skipHydration: true
        }

    )

)