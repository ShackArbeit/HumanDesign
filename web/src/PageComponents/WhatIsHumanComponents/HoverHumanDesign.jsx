import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import { QueryState } from '../../components/QueryState';
import style from '../../CssModules/HumanDesignIntroduce.module.css';
import { useContent } from '../../hooks/useContent';

const HoverHumanDesign = () => {
  const query = useContent('hd-index');

  return (
    <QueryState query={query}>
      {(items) => (
        <Container fluid className={style.HoverHumanDesignWarap}>
          {items.map((item) => (
            <Link to={item.linkPath} style={{ cursor: 'pointer' }} key={item.id}>
              <div className={style.HoverHumanDesignItem}>
                <img src={`https://picsum.photos/400/400?random=${item.id}`} alt="" />
                <div className={style.HoverHumanDesignText}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </div>
            </Link>
          ))}
        </Container>
      )}
    </QueryState>
  );
};

export default HoverHumanDesign;
