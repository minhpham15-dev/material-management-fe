import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
export const ButtonBack = ({ children }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };
  return (
    <Button variant="contained" size="large" onClick={handleBackClick}>
      {children ?? 'Quay lại'}
    </Button>
  );
};
