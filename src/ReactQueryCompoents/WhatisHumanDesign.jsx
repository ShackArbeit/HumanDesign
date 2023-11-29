import { useQuery } from '@tanstack/react-query';
// 內在權威=做決定方法的 Hook
export const useAuthorHumanDesign=()=>{
      return useQuery({
            queryKey:['authorHumanDesign'],
            queryFn:
            async()=>{
                  const response=await fetch('http://localhost:8000/human/authorHuman')
                  const data=await response.json()
                  return data
            }
      })
}
// 能量中心=你的強弱的 Hook
export const useEnergyHumanDesign=()=>{
      return useQuery({
            queryKey:['energyHumanDesign'],
            queryFn:
            async()=>{
                  const response=await fetch('http://localhost:8000/human/energyHuman')
                  const data=await response.json()
                  return data
            }
      })
}
// 人類圖是你的使用說明書的 Hook
export const useExplainHumanDesign=()=>{
      return useQuery({
            queryKey:['explainHumanDesign'],
            queryFn:async()=>{
                  const response=await fetch('http://localhost:8000/human/explainHuman')
                  const data=await response.json()
                  return data
            }
      })
}
// 點擊後的 Hover 選項頁面的 Hook
export const useHoverHumanDesing=()=>{
      return useQuery({
            queryKey:['hoverHumanDesign'],
            queryFn:async()=>{
            const response = await fetch('http://localhost:8000/human/hoverIntroducer');
            const data=await response.json()
            return data
            }
      })
}
// Ra Ura 介紹作者頁面的 Hook
export const useWriterHumanDesign=()=>{
      return useQuery({
            queryKey:['writerHumanDesign'],
            queryFn:async()=>{
                  const response = await fetch('http://localhost:8000/human/writerHuman');
                  const data = await response.json()
                  return data
            }
      })
}
// 通道=你的天賦頁面的 Hook
export const useRoadHumanDesign=()=>{
      return useQuery({
            queryKey:['roadHumanDesign'],
            queryFn:async()=>{
                  const response = await fetch('http://localhost:8000/human/roadHuman');
                  const data=await response.json()
                  return data
            }
      })
}
// 人生腳色=你的性格頁面的 Hook
export const useRoleHumanDesign=()=>{
      return useQuery({
            queryKey:['roleHumanDesign'],
            queryFn:async()=>{
                  const response = await fetch('http://localhost:8000/human/roleHuman');
                  const data=await response.json()
                  return data
            }
      })
}
// 類型=你的天職頁面的 Hook
export const useTypeHumanDesign=()=>{
      return useQuery({
            queryKey:['typeHumanDesign'],
            queryFn:async()=>{
                  const response = await fetch('http://localhost:8000/human/talentHuman');
                  const data=await response.json();
                  return data;
          }
      })
}
// 輪迴交叉 = 你的命運頁面的 Hook 
export const useCircleHumanDesign=()=>{
      return useQuery({
            queryKey:['circleHumanDesign'],
            queryFn:async()=>{
                  const response=await fetch('http://localhost:8000/human/circleHuman')
                  const data=await response.json();
                  return data;
            }
      })
}