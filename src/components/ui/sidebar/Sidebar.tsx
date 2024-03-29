'use client'
import Link from "next/link"
import clsx from "clsx"
import { useSession } from 'next-auth/react'

import { useAddressStore, useUIStore } from "@/store"
//esto es x el onClick, evento del cliente
import { IoCloseOutline, IoLogInOutline, IoLogOutOutline, IoPeopleOutline, IoPersonOutline, IoSearchOutline, IoShirtOutline, IoTicketOutline } from "react-icons/io5"
import { logout } from "@/actions"


export const Sidebar = () => {

    //si uso un hook tengo que poner que es 'use client'
    const isSideMenuOpen = useUIStore(state => state.isSideMenuOpen)
    const closeMenu = useUIStore(state => state.closeSideMenu)

    const cleanAddress = useAddressStore(state => state.cleanAddress)
    const onLogout = () => {
        cleanAddress()
        logout()
    }

    const { data: session } = useSession()

    const isAuthenticated = !!session?.user
    const isAdmin = session?.user.role === 'admin'

    return (
        <div>
            {/* background black  */}

            {
                isSideMenuOpen && (
                    <div
                        className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30 "
                    />

                )
            }

            {/* BLUR */}
            {
                isSideMenuOpen && (
                    <div
                        onClick={closeMenu}
                        className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
                    />
                )
            }


            {/* sideMenu */}
            <nav
                className={
                    clsx(
                        "overflow-y-scroll fixed p-5 right-0 top-0 w-[450px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
                        {
                            "translate-x-full": !isSideMenuOpen
                        }
                    )
                }
            >

                <IoCloseOutline
                    size={50}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={closeMenu} //evento del cliente
                />

                {/* input */}

                <div className="relative mt-14">
                    <IoSearchOutline
                        size={20}
                        className="absolute top-2 left-2"
                    />
                    <input
                        type="text"
                        placeholder="Buscar"
                        className="w-full bg-gray-100 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Menú */}

                {
                    isAuthenticated && (
                        <>
                            <Link
                                href="/profile"
                                className="flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all"
                                onClick={closeMenu}
                            >
                                <IoPersonOutline size={30} />
                                <span className="ml-3 text-lg">Perfil</span>
                            </Link>
                            <Link
                                href="/orders"
                                className="flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all"
                                onClick={closeMenu}
                            >
                                <IoTicketOutline size={30} />
                                <span className="ml-3 text-lg">Ordenes</span>
                            </Link>

                            <button
                                className="w-full flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all"
                                onClick={onLogout} //lo mando asi xq no puedo poner onClick={logout}
                            //xq estaria mandando todo el evento como argumento y eso no se puede
                            //en los servers actions
                            >
                                <IoLogOutOutline size={30} />
                                <span className="ml-3 text-lg">Salir</span>
                            </button>
                        </>
                    )
                }

                {
                    !isAuthenticated && (
                        <Link
                            href="/auth/login"
                            className="flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all"
                            onClick={closeMenu}
                        >
                            <IoLogInOutline size={30} />
                            <span className="ml-3 text-lg">Ingresar</span>
                        </Link>
                    )
                }

                {
                    isAdmin && (
                        <>
                            {/* line Separator */}
                            <div className="w-full h-0.5 bg-gray-200 my-10 rounded-md" />

                            <Link
                                href="/admin/products"
                                onClick={closeMenu}
                                className="flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all"
                            >
                                <IoShirtOutline size={30} />
                                <span className="ml-3 text-lg">Productos</span>
                            </Link>

                            <Link
                                href="/admin/orders"
                                className="flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all"
                                onClick={closeMenu}
                            >
                                <IoTicketOutline size={30} />
                                <span className="ml-3 text-lg">Ordenes</span>
                            </Link>

                            <Link
                                href="/admin/users"
                                className="flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all"
                                onClick={closeMenu}
                            >
                                <IoPeopleOutline size={30} />
                                <span className="ml-3 text-lg">Usuarios</span>
                            </Link>
                        </>
                    )
                }
            </nav >
        </div>


    )
}
