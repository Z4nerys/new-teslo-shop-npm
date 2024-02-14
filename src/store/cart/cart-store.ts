import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartProduct } from "@/interfaces";

interface State {

    cart: CartProduct[];

    getTotalItems: () => number;

    //metodos para modificar el carrito
    addProductToCart: (product: CartProduct) => void
    // updateProductQuantity
    // removeProduct
}

export const useCartStore = create<State>()(

    persist(
        (set, get) => ({
            cart: [],

            getTotalItems: () => {
                const { cart } = get()
                return cart.reduce((total, item) => total + item.quantity, 0)
            },
            //metodos
            addProductToCart: (product: CartProduct) => {
                const { cart } = get()
                
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
            name: 'shopping-cart'
        }

    )

)