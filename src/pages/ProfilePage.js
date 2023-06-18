import { Helmet } from 'react-helmet-async';
import { Avatar, Card, Container, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { axiosClient } from '../utils/axiosClient';
import { DatePickerElement, FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  const getProfile = async () => axiosClient.get('/api/profile');

  useEffect(() => {
    getProfile().then((res) => setProfile(res.data.data));
  }, []);

  const formContext = useForm({
    defaultValues: {
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      date_of_birth: profile?.date_of_birth || '',
      address: profile?.address || '',
      role: profile?.role || '',
      is_male: profile?.is_male || '',
    },
  });
  useEffect(() => {
    formContext.setValue('name', profile?.name || '');
    formContext.setValue('is_male', profile?.is_male ? 'Nam' : 'Nữ' || '');
    formContext.setValue('date_of_birth', dayjs(profile?.date_of_birth ?? new Date()) || '');
    formContext.setValue('address', profile?.address || '');
    formContext.setValue('phone', profile?.phone || '');
    formContext.setValue('role', profile?.role === 1 ? 'Quản lý' : 'Nhân viên' || '');
    formContext.setValue('email', profile?.email || '');
  }, [profile]);
  console.log(profile);
  return (
    <>
      <Helmet>
        <title>Thông tin cá nhân</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Thông tin cá nhân
          </Typography>
        </Stack>
        <Card>
          <FormContainer formContext={formContext}>
            <Stack direction="row" alignItems="flex-start" justifyContent="space-around" mt={5}>
              <Stack
                direction="column"
                alignItems="normal"
                justifyContent="space-between"
                spacing={{ xs: 1, sm: 2, md: 4 }}
              >
                <Avatar alt="Avatar profile" src={profile && (profile.avatar ?? '')} sx={{ width: 90, height: 90 }} />
              </Stack>
              <Stack
                direction="column"
                alignItems="normal"
                justifyContent="space-between"
                spacing={{ xs: 1, sm: 2, md: 4 }}
                mb={5}
              >
                <TextFieldElement name="name" label="Tên" disabled />
                <TextFieldElement name="is_male" label="Giới tính" disabled />
                <DatePickerElement name="date_of_birth" label="Ngày sinh" disabled />
                <TextFieldElement name="address" label="Địa chỉ" disabled />
              </Stack>

              <Stack
                direction="column"
                alignItems="normal"
                justifyContent="space-around"
                spacing={{ xs: 1, sm: 2, md: 4 }}
                mb={5}
              >
                <TextFieldElement name="phone" label="Số điện thoại" disabled />
                <TextFieldElement name="role" label="Chức vụ" disabled />
                <TextFieldElement name="email" label="Email" disabled />
              </Stack>
            </Stack>
          </FormContainer>
        </Card>
      </Container>
    </>
  );
}
