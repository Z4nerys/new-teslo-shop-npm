# Descripcion


## correr en dev
1. Instalar dependencias: `npm install`.
2. Crear una copia del archivo: `.env.template` y renombrarlo a `.env` y cambiar las variables de entorno.
3. Levantar la base de datos: `docker compose up -d`.
4. Correr las migraciones de Prisma `npx prisma migrate dev`
5. Ejecutar seed `npm run seed`
6. Limpiar localstorage del navegador web.
7. Correr el proyecto: `npm run dev`.

## se puede visualizar tambien la db con el comando
`npx prisma studio`
esto habre una url localhost para visualizar la db
y sino se puede usar table plus.

## Correr en prod
mis backticks = ``

BUSCAR COMO PONER LOGUER del lado del servidor


