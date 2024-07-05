import { useQuery } from '@tanstack/react-query';

// 首頁介紹解析項目的部分
export const useService=()=>{
      return useQuery({
            queryKey:['serviceHumanDesign'],
            queryFn:async()=>{
                  const response = await fetch('https://humannode.onrender.com/home/serviceProcess');
                  const data=await response.json()
                  return data
            }
      })
}
export const useBooking=()=>{
      return useQuery({
            queryKey:['bookingHumanDesign'],
            queryFn:async()=>{
                  const response = await fetch('https://humannode.onrender.com/home/bookingProcess');
                  const data=await response.json()
                  return data
            }
      })
}