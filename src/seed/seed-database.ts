import { initialData } from "./seed";
import prisma from '../lib/prisma';
//no se usa el arroba xq no es next

async function main() {

    //1. Borrar registros previos
    await Promise.all([
        prisma.productImage.deleteMany(),
        prisma.product.deleteMany(),
        prisma.category.deleteMany()
    ])

    console.log('Seed ejecutado correctamente')
}

//funcion anonima autoinvocada
(() => {


    if( process.env.NODE_ENV === 'production') return;
    main()
})();