import { initialData } from "./seed";
import prisma from '../lib/prisma';
//no se usa el arroba xq no es next

async function main() {

    //1. Borrar registros previos
    /* await Promise.all([
        prisma.productImage.deleteMany(),
        prisma.product.deleteMany(),
        prisma.category.deleteMany()
    ]) */

    //se usa el await y no el Promise.all x las relaciones de la db y tiene que ser
    //eliminado en orden
    await prisma.user.deleteMany();
    await prisma.country.deleteMany();

    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    const { categories, products, users, countries } = initialData

    //insertar usuarios
    await prisma.user.createMany({
        data: users
    })

    //insertar paises
    await prisma.country.createMany({
        data: countries
    })

    // insertar Categorias
    const categoriesData = categories.map(category => ({ name: category }))

    await prisma.category.createMany({
        data: categoriesData
    })

    //me mandan la categoria y busco el id. primero tengo que hacer
    //esta relacion para despues insertar los productos

    //una sola consulta a la db, mientras menos consultas, mejor.
    const categoriesDB = await prisma.category.findMany()
    const categoriesMap = categoriesDB.reduce((map, category) => {
        map[category.name.toLowerCase()] = category.id
        return map
    }, {} as Record<string, string>); // <string=shirt, string=categoryID> . asi luce

    //PRODUCTOS
    //insertar productos
    //Nuestro seed tiene datos que no tenemso en nuestra tabla
    // el type, las imagenes. resolver eso

    /*  
    ejemplo para uno
    const {images, type, ...product1} = products[0]
    //saco images y type xq no esta en la tabla
    await prisma.product.create({
         data: {
             ...product1,
             categoryId: categoriesMap['shirts']
         }
    }) */

    //insertar todos los productos
    products.forEach( async (product) => {
        const { type, images, ...rest } = product;
        const dbProduct = await prisma.product.create({
            data:{
                ...rest,
                categoryId: categoriesMap[type]
            }
        })

        //images
        const imagesData = images.map( image => ({
            url: image,
            productId: dbProduct.id
        }))

        await prisma.productImage.createMany({
            data: imagesData
        })
    })

    console.log('Seed ejecutado correctamente')
}

//funcion anonima autoinvocada
(() => {


    if (process.env.NODE_ENV === 'production') return;
    main()
})();