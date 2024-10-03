import React, { useEffect } from 'react';
import { fetchItems } from './api/endpoints';

interface ApiResponse {
  message: string;
}

const App: React.FC = () => {
  const [response, setResponse] = React.useState<ApiResponse>();

  useEffect(() => {
    const getData = async () => {
      const res = await fetchItems();
      setResponse(res.data);
    };
    getData();
  }, []);

  return <>{response && <div>{response.message}</div>}</>;
};

export default App;
