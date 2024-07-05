import { useQuery } from '@tanstack/react-query';

export const useUserFeedBack=()=>{
      return useQuery({
            queryKey:['userFeedBack'],
            queryFn:async()=>{
                  const response = await fetch('https://humannode.onrender.com/feedback/jdShare');
                  const data=await response.json()
                  return data
            }
      })
}