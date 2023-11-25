import style from '../../CssModules/HumanDesignIntroduce.module.css'
import Container from 'react-bootstrap/Container';
import { useHoverHumanDesing } from '../../ReactQueryCompoents/WhatisHumanDesign';
import {Link} from 'react-router-dom'

const HoverHumanDesign = () => {

const{data:datas,isLoading,error}=useHoverHumanDesing()
  if(isLoading) return <p>Loading...</p>
  if(error) return <p>Error :{error.message}</p>
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