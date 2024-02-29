import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import bcryptjs from 'bcryptjs';

const authenticatedRoutes = [
    '/checkout/',
    '/checkout/address',
]

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/new-account'
    },
    callbacks: {
        //REVISAR ESTE MIDDLEWARE. funciona como middleware. authorized 
        //https://neoris.udemy.com/course/nextjs-fh/learn/lecture/41266812#questions/21127026
        //https://nextjs.org/learn/dashboard-app/adding-authentication
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = authenticatedRoutes.includes(nextUrl.pathname)
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return true
                //return Response.redirect(new URL('/checkout/address', nextUrl));
            }
            return true;
        },
        jwt({ token, user }) {
            if (user) {
                token.data = user
            }
            return token
        },
        session({ session, token, user }) {
            session.user = token.data as any;
            /* los datos estan en el token, si estoy logueado y hago un cambio en la db, no se va a ver a menos
            que me desloguee y me vuelva a loguear.
            analizar el token e ir a la db para establecer los cambios */
            return session
        },
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (!parsedCredentials.success) return null

                const { email, password } = parsedCredentials.data

                //buscar el correo
                const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

                if (!user) return null

                //comparar las contraseñas
                if (!bcryptjs.compareSync(password, user.password)) return null

                //Regresar el usuario
                //sacamos el password para no devolverlo
                //lo hacemos asi xq ya tenemos otra propiedad llamada password
                const { password: _, ...rest } = user
                return rest
            },
        }),
    ]
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig)