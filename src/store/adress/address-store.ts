import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
    address: {
        firstName: string;
        lastName: string;
        address: string;
        address2?: string;
        postalCode: string;
        city: string;
        country: string;
        phone: string;
    };

    //methods
    setAddress: (address: State['address']) => void
    //esto significa que setAddress va a recibir todos los argumentos
    //que tengo en el state address. lo de arriba

}

export const useAddressStore = create<State>()(
    persist(
        (set, get) => ({
            address: {
                firstName: '',
                lastName: '',
                address: '',
                address2: '',
                postalCode: '',
                city: '',
                country: '',
                phone: '',
            },
            setAddress(address) {
                set({address})
            },
        }),
        {
            name: "address-storage"
        }
    )
)