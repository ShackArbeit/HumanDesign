import { createContext } from 'react';

export const SendEmailContext=createContext()

export default function SendEmailProvider({ children }){
        const handleSendEamil=async ()=>{
            try{
                const response=await fetch('http://localhost:8000/sendEmail',{
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                })
                const responseData=await response.json()
                console.log(responseData)
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