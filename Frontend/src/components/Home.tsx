import React from 'react';
import Form from './Form';
import '../styles/global.css';
import Dashboard from './Dashboard';
import { useAuth } from './AuthContext';

const Home: React.FC = () => {
  const { token } = useAuth();

  return (
    <div className='container-home'>
      {token ? 
          <Dashboard />
        : <Form />
      }
    </div>
  );
};

export default Home;
