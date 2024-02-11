import { CartProduct } from "@/interfaces";
import { create } from "zustand";

interface State {

    cart: CartProduct[];

    //metodos para modificar el carrito
    // addProductToCart
    // updateProductQuantity
    // removeProduct
}

export const useCartStore = create<State>()(
    (set) => ({

        cart: []
    })
)