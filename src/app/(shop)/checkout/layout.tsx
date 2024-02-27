
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

//esta ruta funciona como middleware
//esta ruta funciona como middleware
//esta ruta funciona como middleware

//ver esto xq en checkout me sale un error de hidratacion

//sino esta autenticado no puede entrar
export default async function CheckoutLayout({ children }: {
    children: React.ReactNode
}) {
    const session = await auth();

    if(!session?.user){
        redirect("/auth/login")
    }

    return (
        <>
            {children}
        </>
    )
}
