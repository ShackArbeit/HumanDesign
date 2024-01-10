import { useState, createContext,useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';

export const SignInContext=createContext()

export default function SignInProvider({children}){
      const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const [open, setOpen] = useState(true);
      const [email, setEmail] = useState('');
      const[password,setPassword]=useState('')
      const[isLoggin,setIsLoggin]=useState(false)
      const StorageEmail=localStorage.getItem('rememberedEmail')
      const StoragePassword=localStorage.getItem('remeberMePassword')
      const negative=useNavigate()
      const handleSubmit = async (event) => {
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
              console.log({email,password,});
          }
          try{
            const response=await fetch('http://localhost:8000/directSignIn',{
              method:'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body:JSON.stringify({email,password}),
            })
            const responseData=await response.json()
            console.log(responseData)
            if(responseData.success){
              Swal.fire({
                title: '登入成功',
                text: `你已經登入成功了 !`,
                icon: 'success',
                confirmButtonText: '了解'
              })
              localStorage.setItem('isLoggin', true);
              setIsLoggin(true)
              negative('/HumanDesign/bookingAfterSignIn')
            }else{
              Swal.fire({
                title: '登入失敗',
                text:'輸入的信箱或密碼有錯誤!',
                icon: 'warning',
                confirmButtonText: '了解'
              })
              return;
            }
        }catch(error){
          console.log('你所輸入的信箱及密碼有錯誤',error)
        }      
  };
        
      const handleSubmitResendPassword= async(event)=>{
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const email = data.get('email');
            if (email==='') {
              Swal.fire({
                title: '不得空白',
                text: '請輸入註冊時的電子信箱 !',
                icon: 'warning',
                confirmButtonText: '了解'
              })
              return;
            }
            // 要求 Email 要符合特殊的格式判斷
            if(!emailRegex.test(email)){
            Swal.fire({
              title: '格式錯誤',
              text: '電子信箱格式不符合要求，請重新輸入 !',
              icon: 'error',
              confirmButtonText: '了解'
            })
            return 
          }
          try{
            const response=await fetch('http://localhost:8000/resendPassword',{
              method:'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body:JSON.stringify({email}),
            })
            const responseData=await response.json()
            console.log(responseData.password)
            if(responseData.success){
              Swal.fire({
                title: '信箱正確',
                text: `我們已經將你的密碼寄送到你的電子信箱內!`,
                icon: 'success',
                confirmButtonText: '了解'
              })
              negative('/HumanDesign')
            }else{
              Swal.fire({
                title: '信箱不正確',
                text:'請確認你註冊時的電子信箱是否正確',
                icon: 'warning',
                confirmButtonText: '了解'
              })
              return;
            }
          }catch(error){
            console.log('error',error)
          }
      }

  useEffect(() => {
    const storedIsLoggin = localStorage.getItem('isLoggin');
    if (storedIsLoggin) {
      setIsLoggin(true);
    }
  }, []);


      return (
            <SignInContext.Provider 
            value={{
                  open,setOpen,passwordPattern,handleSubmit,
                  email,setEmail,password,setPassword,isLoggin,
                  setIsLoggin,StorageEmail,StoragePassword,handleSubmitResendPassword
            }}
            >
                  {children}
            </SignInContext.Provider>
      )
}
