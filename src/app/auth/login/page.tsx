import { titleFont } from '@/config/fonts';
import { LoginForm } from './ui/LoginForm';

//las paginas se tienen que generar del lado del servidor
//y del cliente solo la parte que necesitamos

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen pt-32 sm:pt-24">

      <h1 className={ `${ titleFont.className } text-4xl mb-5` }>Ingresar</h1>

      <LoginForm/>
    </div>
  );
}