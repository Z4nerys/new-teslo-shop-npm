'use client'

import Link from "next/link"

import { SubmitHandler, useForm } from "react-hook-form";
import { IoWarningOutline } from "react-icons/io5";
import clsx from "clsx";

import { login, registerUser } from "@/actions";
import { useState } from "react";

type FormInputs = {
    name: string;
    email: string;
    password: string;

}

/* contraseñas: 123456
o: 12345A */
export const RegisterForm = () => {

    const [errorMessage, setErrorMessage] = useState('')
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>()

    //otra opcion => 
    //const onSubmit = async(data: FormInputs) => {
    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        const { name, email, password } = data
        //Server action
        const resp = await registerUser(name, email.toLowerCase(), password)
        if( !resp.ok ){
            setErrorMessage(resp.message)
            return
        }
        //se crea exitosamente y redirecciono
        await login(email.toLowerCase(), password)
        
        window.location.replace('/')
        
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            {/* {
                errors.name?.type === 'required' && (
                    <span className="text-red-600">* El nombre es obligatorio.</span>
                )
            } */}

            <label htmlFor="name"
                className={clsx("",{'text-red-600': !!errors.name})}
            >
                Nombre completo
            </label>
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            'border-red-600': !!errors.name
                        }
                    )
                }
                type="text"
                {...register('name', { required: true })}
                autoFocus
            />

            <label htmlFor="email" className={clsx("",{'text-red-600': !!errors.email})}>Correo electrónico</label>
            {
                errors.email?.type === 'pattern' && (
                        <span className="text-red-600">* Email invalido</span> 
                        /* <div className="flex bg-red-500 text-white rounded-md shadow-md px-2 py-2 mb fade-in items-center">
                        <div>Email invalido.</div>
                        <div className="ml-auto"><IoWarningOutline size={25} /></div>
                    </div> */
                )
            }
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            'border-red-600': !!errors.email
                        }
                    )
                }
                type="email"
                autoComplete="email"
                {...register('email', { required: true, pattern: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/ })}
            />

            <label htmlFor="password" className={clsx("",{'text-red-600': !!errors.password})}>Contraseña</label>
            {/* PODRIA CREAR UN COMPONENTE PARA MOSTRAR ERRORES, asi le paso las condiciones y que muestre. */}
            {
                errors.password?.type === 'minLength' && (
                        <span className="text-red-600">6 caracteres minimo.</span> 
                        /* <div className="flex bg-red-500 text-white rounded-md shadow-md px-2 py-2 mb fade-in items-center">
                        <div>Email invalido.</div>
                        <div className="ml-auto"><IoWarningOutline size={25} /></div>
                    </div> */
                )
            }
            {
                errors.password?.type === 'pattern' && (
                        <span className="text-red-600">1 mayuscula minimo.</span> 
                        /* <div className="flex bg-red-500 text-white rounded-md shadow-md px-2 py-2 mb fade-in items-center">
                        <div>Email invalido.</div>
                        <div className="ml-auto"><IoWarningOutline size={25} /></div>
                    </div> */
                )
            }
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            'border-red-600': !!errors.password
                        }
                    )
                }
                type="password"
                autoComplete="current-password"
                {...register('password', { required: true, minLength: 6, pattern: /^(?=.*[A-Z]).{6,}$/ })}
            />

                <span className="text-red-600">{errorMessage}</span>
            <button
                className="btn-primary"
                type="submit"
            >
                Crear cuenta
            </button>

            {/* divisor l ine */}
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link
                href="/auth/login"
                className="btn-secondary text-center">
                Ingresar
            </Link>

        </form>
    )
}
