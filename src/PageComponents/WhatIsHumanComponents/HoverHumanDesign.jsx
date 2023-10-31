import style from '../../CssModules/HumanDesignIntroduce.module.css'
import Container from 'react-bootstrap/Container';
import { useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setData } from '../../ToolkitComponents/AboutFetchApi/AboutJeromeSlice'
import {Link} from 'react-router-dom'

const HoverHumanDesign = () => {
  const datas=useSelector((state)=>state.aboutJerome)
  const dispatch=useDispatch()
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://localhost:8000/human/hoverIntroducer');
            const Data = await response.json();
            dispatch(setData(Data));
          } 
          catch (error) {
            console.log(error);
          }
        };
        fetchData();
      }, [])
  return (
    <Container fluid className={style.HoverHumanDesignWarap}>
    {datas.map((data,index)=>(
      <Link to={data.url} style={{cursor:'pointer'}}  key={index}>
        <div className={style.HoverHumanDesignItem}>
        <img src={`https://picsum.photos/400/400?random=${data.id}`} />
        <div className={style.HoverHumanDesignText}>
            <h3>{data.title}</h3>
            <p>{data.content}</p>
        </div> 
        </div>
        </Link>
    ))}
    </Container>
  )
}

export default HoverHumanDesign