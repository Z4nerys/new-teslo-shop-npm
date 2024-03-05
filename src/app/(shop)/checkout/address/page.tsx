//esto es estatico
//esto se genera del lado del servidor
//puedo poner la revalidacion para que se haga la consulta
//a la db cada cierto tiempo
//export const revalidate = 604800 // 7 dias. aprox
//aca no lo necesito xq los paises no cambian pero si hay
//algo que tengo que cambiar cad cierto tiempo
//uso el revalidate

import { Title } from '@/components';
import { AddressForm } from './ui/AddressForm';
import { getCountries, getUserAddress } from '@/actions';
import { auth } from '@/auth.config';

export default async function AddressPage() {

  //pongo esto aca xq addressPage es un server component
  //esto queda en cache, xq lo hago del lado del servidor
  const countries = await getCountries()

  const session = await auth();

  if(!session?.user){
    return (
      <h3 className='text-5xl'>500 - No hay sesión de usuario</h3>
    )
  }

  const userAddress = await getUserAddress(session.user.id) ?? undefined
  console.log(userAddress)

  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">

      <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">

        <Title title="Dirección" subtitle="Dirección de entrega" />

        <AddressForm countries={countries} userStoreAddress={userAddress}/>

      </div>
    </div>
  );
}