'use client'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { CreateOrderData, CreateOrderActions, OnApproveActions, OnApproveData } from '@paypal/paypal-js';
import { paypalCheckPayment, setTransactionId } from '@/actions';

interface Props {
  orderId: string; //orden de la compra. id de la orden de la compra
  amount: number; //paypal no acepta mas de 4 decimales.
  //y tiene que ser un string el amount
}

export const PayPalButton = ({ orderId, amount }: Props) => {

  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <div className='animate-pulse mb-12'>
        <div className='h-12 bg-gray-300 rounded' />
        <div className='h-12 bg-gray-300 rounded mt-3' />
      </div>
    )
  }

  const roundedAmount = (Math.round(amount * 100)) / 100; //189,50 ejemplo

  const createOrder = async (data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {
    //crea un id
    const transactionId = await actions.order.create({
      purchase_units: [
        {
          //invoice_id: 'order_id', este es unico, si se lo mando, lo tengo que usar siempre
          //asi que x el momento no lo uso
          amount: {
            currency_code: "USD", // o cualquier otra moneda que estés utilizando
            value: `${roundedAmount}`, // así lo transformo en string
          }
        }
      ],
      intent: 'CAPTURE'
    });
    //esto es para generar un identificador
    const { ok } = await setTransactionId(orderId, transactionId)
    //el transactionId lo tengo que guardar en mi DB para asociarlo
    // Todo: guardar el ID en la tabla order de la DB

    if (!ok) {
      throw new Error('No se pudo actualizar la orden')
    }

    return transactionId
  }


  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {

    const details = await actions.order?.capture()
    
    if (!details) return

    //server action
    await paypalCheckPayment( details.id!) //details.id es el transaction id de mi db
    
  }

  return (
    <>
      <PayPalButtons
        //esto es para crear un ID de transaccion
        createOrder={createOrder}
        //esto para saber si se aprobo el pago. si salio todo exitoso end to end
        onApprove={onApprove}
      />
    </>
  )
}