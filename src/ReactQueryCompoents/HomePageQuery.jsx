import { useQuery } from '@tanstack/react-query';

// 首頁介紹解析項目的部分
export const useService=()=>{
      return useQuery({
            queryKey:['serviceHumanDesign'],
            queryFn:async()=>{
                  const response = await fetch('http://localhost:8000/home/serviceProcess');
                  const data=await response.json()
                  return data
            }
      })
}
export const useBooking=()=>{
      return useQuery({
            queryKey:['bookingHumanDesign'],
            queryFn:async()=>{
                  const response = await fetch('http://localhost:8000/home/bookingProcess');
                  const data=await response.json()
                  return data
            }
      })
}