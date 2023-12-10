import { useQuery } from '@tanstack/react-query';






export const useCheckBooking=()=>{
        return useQuery({
            queryKey:['checkBooking'],
            queryFn:async()=>{
                const response=await fetch(`http://localhost:8000/fetchData`,{
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`, // 傳送身份識別資訊的 header
                    },
                })
                const data=await response.json();
                return data
            }
        })
        
}