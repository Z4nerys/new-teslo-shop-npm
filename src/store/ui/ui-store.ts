import { create } from 'zustand'

interface State {
    isSideMenuOpen: boolean;

    openSideMenu: () => void;
    closeSideMenu: () => void;
}

//otro parentesis xq asi se recomienda en typescript
// normal => create<State>((set) => ({}))
// recomendado en typescript => create<State>()((set) => ({}))

export const useUIStore = create<State>()((set) => ({
    isSideMenuOpen: false,

    openSideMenu: () => set({ isSideMenuOpen: true }),
    closeSideMenu: () => set({ isSideMenuOpen: false })
}))