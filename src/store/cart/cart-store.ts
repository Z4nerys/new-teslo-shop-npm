import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartProduct } from "@/interfaces";

interface State {

    cart: CartProduct[];

    getTotalItems: () => number;
    getSummaryInformation: () => {
        subTotal: number;
        tax: number;
        total: number;
        itemsInCart: number;
    }
    //metodos para modificar el carrito
    addProductToCart: (product: CartProduct) => void
    updateProductQuantity: (product: CartProduct, quantity: number) => void
    removeProduct: (product: CartProduct) => void

    clearCart: () => void
}

export const useCartStore = create<State>()(

    persist(
        (set, get) => ({
            cart: [],

            getTotalItems: () => {
                const { cart } = get()
                return cart.reduce((total, item) => total + item.quantity, 0)
            },
            getSummaryInformation: () => {
                const { cart } = get();

                const subTotal = cart.reduce((subtotal, product) => product.quantity * product.price + subtotal, 0)
                const tax = subTotal * 0.15
                const total = subTotal + tax
                const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0)
                return {
                    subTotal,
                    tax,
                    total,
                    itemsInCart
                }
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
            },

            updateProductQuantity: (product: CartProduct, quantity: number) => {
                const { cart } = get()
                const updateCartProducts = cart.map(item => {
                    if (item.id === product.id && item.size === product.size) {
                        return { ...item, quantity }
                    }
                    return item
                })
                set({ cart: updateCartProducts })
            },
            removeProduct: (product: CartProduct) => {
                const { cart } = get()
                const updateCartProducts = cart.filter(
                    item => item.id !== product.id || item.size !== product.size
                );
                set({ cart: updateCartProducts })
            },
            clearCart: () => {
                set({ cart: [] })
            }
        }),
        {
            name: 'shopping-cart'
        }

    )

)