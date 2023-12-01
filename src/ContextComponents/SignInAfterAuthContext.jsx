import { useState, createContext } from 'react';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
export const SignInAfterAuthContext=createContext()

export default function SignInAfterAuthProvider({children}){
      const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const [open, setOpen] = useState(true);
      const negative=useNavigate()
      const handleSubmit = (event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const email = data.get('email');
          const password = data.get('password');
          if (email==='' || password==='') {
            Swal.fire({
              title: '不得空白',
              text: '請輸入信箱或密碼 !',
              icon: 'warning',
              confirmButtonText: '了解'
            })
            return;
          }
           // 要求密碼要符合特殊的格式的判斷
           else if (!passwordPattern.test(password )) {
            Swal.fire({
              title: '格式錯誤',
              text: '密碼格式不符合要求，請重新輸入 !',
              icon: 'error',
              confirmButtonText: '了解'
            })
            return;
        }
         // 要求 Email 要符合特殊的格式判斷
         else if(!emailRegex.test(email)){
          Swal.fire({
            title: '格式錯誤',
            text: '電子信箱格式不符合要求，請重新輸入 !',
            icon: 'error',
            confirmButtonText: '了解'
          })
          return 
        }
        else{
            negative('/HumanDesign/bookingAfterSignIn')
            console.log({email,password,});
        }
      }


      return (
            <SignInAfterAuthContext.Provider
            value={{open,setOpen,handleSubmit,passwordPattern}}
            >
                  {children}
            </SignInAfterAuthContext.Provider>
      )
}