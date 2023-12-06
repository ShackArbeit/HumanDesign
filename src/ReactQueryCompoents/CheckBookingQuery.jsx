import { useQuery } from '@tanstack/react-query';

export const useCheckBooking=()=>{
        return useQuery({
            queryKey:['checkBooking'],
            queryFn:async()=>{
                const response=await fetch('http://localhost:8000/fetchData/656fe0d10e6fc62fa136fc4e')
                const data=await response.json();
                return data
            }
        })
        
}