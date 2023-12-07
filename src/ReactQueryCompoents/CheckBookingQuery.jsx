import { useQuery } from '@tanstack/react-query';

export const useCheckBooking=()=>{
        return useQuery({
            queryKey:['checkBooking'],
            queryFn:async()=>{
                const response=await fetch(`http://localhost:8000/fetchData`)
                const data=await response.json();
                return data
            }
        })
        
}