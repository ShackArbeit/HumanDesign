import { useState, createContext } from 'react';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';

export const SingUpContext=createContext()

export default function SignUpProvider({children}){
     
     const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [open, setOpen] = useState(true);
    const [rememberMe, setRememberMe] = useState(false);
    const [emailValue, setEmailValue] = useState('');
    const negative=useNavigate()
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const password = data.get('password');
        const confirmPassword = data.get('ConfirmPassword');
        if(email===''||password===''||confirmPassword===''){
          Swal.fire({
            title: '不得空白',
            text: '請輸入信箱或密碼 !',
            icon: 'warning',
            confirmButtonText: '了解'
          })
            return ;
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
      // 要求密碼要符合特殊的格式的判斷
      else if (!passwordPattern.test(password &&confirmPassword)) {
          Swal.fire({
            title: '格式錯誤',
            text: '密碼格式不符合要求，請重新輸入 !',
            icon: 'error',
            confirmButtonText: '了解'
          })
          return;
      }
      else if (password !== confirmPassword) {
          Swal.fire({
            title: '格式錯誤',
            text: '你的密碼與確認密碼不相同，請重新輸入 !',
            icon: 'error',
            confirmButtonText: '了解'
          })
          return;
        }
        else{
            console.log({email,password,});
        }
        try{
            const response= await fetch('http://localhost:8000/signUp',{
              method:'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body:JSON.stringify({email,password,confirmPassword})
            })
            const responseData=await response.json()
            console.log(responseData)
            if(responseData.success){
              Swal.fire({
                title: '註冊成功',
                text: `我們已成功接受您於的註冊了 !`,
                icon: 'success',
                confirmButtonText: '了解'
              })
              if (rememberMe) {
                // 使用 localStorage 存儲使用者的 Email
                localStorage.setItem('rememberedEmail', email);
                localStorage.setItem('remeberMePassword',password)
              }
              setEmailValue(email);
              negative('/HumanDesign/afterSignUp')
            }else{
              Swal.fire({
                title: '註冊失敗',
                text:'系統發生問題或是信箱重複註冊了 !',
                icon: 'warning',
                confirmButtonText: '了解'
              })
              return;
            }
        }catch(error){
          console.log(error)
        }
};


      return(
            <SingUpContext.Provider value={{
                  open,setOpen,handleSubmit,
                  passwordPattern,rememberMe,
                  setRememberMe,emailValue
            }}>
                  {children}
            </SingUpContext.Provider>
      )

}