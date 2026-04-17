import { useParams } from 'react-router-dom';

const RequestPage = () => {
  const { id } = useParams();
  console.log(id);
  return <div>{id}</div>;
};

export default RequestPage;
