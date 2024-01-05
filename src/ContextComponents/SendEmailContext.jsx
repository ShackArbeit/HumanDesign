import { createContext} from 'react';
import Swal from 'sweetalert2';
import {useNavigate} from 'react-router-dom'


export const SendEmailContext=createContext()

export default function SendEmailProvider({ children }){
    
       const negative=useNavigate()
        const handleSendEamil=async ()=>{
            try{
                const userConfirmed = window.confirm('確認後將無法再刪除預約，是否已確定此次預約?');
            if(userConfirmed){
                const response=await fetch('http://localhost:8000/sendEmail',{
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                })
                const responseData=await response.json()
                
                    if( responseData){
                        const result = await Swal.fire({
                                title: '確認信',
                                text: '已將匯款相關細節寄至你的 Email 內，請查閱 !',
                                icon: 'success',
                                showCancelButton: true,
                                confirmButtonText: '確認',
                                cancelButtonText: '取消',
                            });
                        if (result.isConfirmed) {
                            negative('/HumanDesign')
                        }
                        }
                        console.log(responseData)
            }
            }catch(error){
                console.log('找不到 Email !'+error)
            }
        }
    return (
        <SendEmailContext.Provider value={{handleSendEamil}}>
            {children}
        </SendEmailContext.Provider>
    )

} 