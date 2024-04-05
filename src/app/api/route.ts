import { NextResponse } from "next/server";

/* De esta forma puedo llamar al endpoint desde postman
http://localhost:3000/api
asi puedo acceder a los endpoints que quiera
*/
export async function GET() {
    console.log('first')
    return NextResponse.json({
        hola: 'hola'
    })
}