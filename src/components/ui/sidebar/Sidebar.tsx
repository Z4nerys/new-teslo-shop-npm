'use client'
import Link from "next/link"
import clsx from "clsx"
import { useSession } from 'next-auth/react'

import { useUIStore } from "@/store"
//esto es x el onClick, evento del cliente
import { IoCloseOutline, IoLogInOutline, IoLogOutOutline, IoPeopleOutline, IoPersonOutline, IoSearchOutline, IoShirtOutline, IoTicketOutline } from "react-icons/io5"
import { logout } from "@/actions"


export const Sidebar = () => {

    //si uso un hook tengo que poner que es 'use client'
    const isSideMenuOpen = useUIStore(state => state.isSideMenuOpen)
    const closeMenu = useUIStore(state => state.closeSideMenu)

    const { data: session } = useSession()

    const isAuthenticated = !!session?.user
    
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
                        "fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
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

                <Link
                    href="/profile"
                    className="flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all"
                    onClick={closeMenu}
                >
                    <IoPersonOutline size={30} />
                    <span className="ml-3 text-lg">Perfil</span>
                </Link>

                <Link
                    href="/"
                    className="flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all"
                >
                    <IoTicketOutline size={30} />
                    <span className="ml-3 text-lg">Ordenes</span>
                </Link>

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
                    isAuthenticated && (
                        <button
                            className="w-full flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all"
                            onClick={() => logout()} //lo mando asi xq no puedo poner onClick={logout}
                        //xq estaria mandando todo el evento como argumento y eso no se puede
                        //en los servers actions
                        >
                            <IoLogOutOutline size={30} />
                            <span className="ml-3 text-lg">Salir</span>
                        </button>
                    )
                }


                {/* line Separator */}
                <div className="w-full h-0.5 bg-gray-200 my-10 rounded-md" />



                <Link
                    href="/"
                    className="flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all"
                >
                    <IoShirtOutline size={30} />
                    <span className="ml-3 text-lg">Productos</span>
                </Link>

                <Link
                    href="/"
                    className="flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all"
                >
                    <IoTicketOutline size={30} />
                    <span className="ml-3 text-lg">Ordenes</span>
                </Link>

                <Link
                    href="/"
                    className="flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all"
                >
                    <IoPeopleOutline size={30} />
                    <span className="ml-3 text-lg">Usuarios</span>
                </Link>

            </nav>
        </div>
    )
}
