import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../iconify';

// eslint-disable-next-line react/prop-types
export const ButtonAdd = ({ children, navigateTo }) => {
  const navigate = useNavigate();

  const handleNewClick = () => {
    navigate(navigateTo);
  };
  return (
    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleNewClick}>
      {children ?? 'Thêm mới'}
    </Button>
  );
};
