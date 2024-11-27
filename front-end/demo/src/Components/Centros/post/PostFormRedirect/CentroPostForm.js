import { useParams } from 'react-router-dom';
import PostForm from '../Formulario/PostForm';

const CentroPostForm = () => {
  const { id } = useParams(); // Obtén el id de los parámetros de la URL

  return <div className="CentroPostFormRedirect" ><PostForm id={id} /></div>
};

export default CentroPostForm;
