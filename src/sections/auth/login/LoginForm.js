import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Checkbox, IconButton, InputAdornment, Link, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import Iconify from '../../../components/iconify';
import { axiosClient } from '../../../utils/axiosClient';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async (v) => {
    const res = await axiosClient.post('/api/login', v);
    localStorage.setItem('token', res.data.data.access_token.token);
    const resRole = await axiosClient.get('/api/profile');
    localStorage.setItem('role', resRole.data.data.role);
    navigate('/home', { replace: true });
  };

  return (
    <>
      <FormContainer onSuccess={(v) => handleClick(v)}>
        <Stack spacing={3}>
          <TextFieldElement name="email" label="Nhập email" />
          <TextFieldElement
            name="password"
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <Link variant="subtitle2" underline="hover">
            Quên mật khẩu?
          </Link>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained">
          Đăng nhập
        </LoadingButton>
      </FormContainer>
    </>
  );
}
