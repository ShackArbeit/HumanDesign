import { useQuery } from '@tanstack/react-query';

export const  useAboutJerome=()=> {
      return useQuery({
        queryKey:['aboutJerome'],
        queryFn:async()=>{
          const years = [2013, 2016, 2019, 2021, 2022];
          const fetchedData = [];
          for (const year of years) {
            const response = await fetch(`http://localhost:8000/aboutJerome/${year}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch data for ${year}`);
            }
            const data = await response.json();
            fetchedData.push(data);
          } 
          return fetchedData;
        }
      })
}