
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);

  return null;
};
