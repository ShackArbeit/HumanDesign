 import { useQuery } from '@tanstack/react-query';


 export const useCheckBooking=()=>{
         return useQuery({
            queryKey:['checkBooking'],
             queryFn:async()=>{
                 const response=await fetch('https://humannode.onrender.com/checkBooking')
                 const data=await response.json();
                 return data
             }
         })  
 }