import { useParams } from 'react-router-dom';
import AdminNuevo from '../AdminNuevo';

const CentroPostForm = () => {
  const { id } = useParams(); // Obtén el id de los parámetros de la URL

  return <div><AdminNuevo id={id} /></div>
};

export default CentroPostForm;
