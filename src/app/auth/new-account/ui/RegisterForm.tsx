'use client'

import clsx from "clsx";
import Link from "next/link"
import { SubmitHandler, useForm } from "react-hook-form";

type FormInputs = {
    name: string;
    email: string;
    password: string;

}

export const RegisterForm = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>()

    //otra opcion => 
    //const onSubmit = async(data: FormInputs) => {
    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        const { name, email, password } = data
        console.log({ name, email, password })
        //Server action
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
                {...register('password', { required: true, minLength: 6 })}
            />

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
