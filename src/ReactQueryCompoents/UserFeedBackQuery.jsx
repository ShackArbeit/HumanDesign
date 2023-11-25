import { useQuery } from '@tanstack/react-query';

export const useUserFeedBack=()=>{
      return useQuery({
            queryKey:['userFeedBack'],
            queryFn:async()=>{
                  const response = await fetch('http://localhost:8000/feedback/jdShare');
                  const data=await response.json()
                  return data
            }
      })
}