import { Helmet } from 'react-helmet-async';
import { Button, Card, Container, Stack, Typography } from '@mui/material';
import { DatePickerElement, FormContainer, SelectElement, TextFieldElement } from 'react-hook-form-mui';
import { ButtonBack } from '../components/button/back-button/ButtonBack';

const gender = [
  {
    id: 1,
    label: 'Nam',
  },
  { id: 0, label: 'Nữ' },
];

export default function CreateEmployeePage() {
  return (
    <>
      <Helmet>Thêm mới nhân viên</Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Thêm mới nhân viên
          </Typography>
        </Stack>
        <Card>
          <FormContainer
            onSuccess={(data) => {
              console.log(data);
            }}
          >
            <Stack direction="row" alignItems="flex-start" justifyContent="space-around" mt={5}>
              <Stack
                direction="column"
                alignItems="normal"
                justifyContent="space-between"
                spacing={{ xs: 1, sm: 2, md: 4 }}
              >
                <TextFieldElement name="name" label="Tên nhân viên" required />
                <SelectElement options={gender} name="isMale" label="Giới tính" required />
                <DatePickerElement name="date_of_birth" label="Ngày sinh" />
                <TextFieldElement name="address" label="Địa chỉ" required />
              </Stack>

              <Stack
                direction="column"
                alignItems="normal"
                justifyContent="space-around"
                spacing={{ xs: 1, sm: 2, md: 4 }}
              >
                <TextFieldElement name="phone" label="Số điện thoại" required />
                <TextFieldElement name="email" label="Email" required type="email" />
                <TextFieldElement name="avatar" type="file" />
              </Stack>
            </Stack>
            <Stack direction="column" alignItems="center" justifyContent="center" mt={2} spacing={2}>
              <SelectElement
                name="role"
                label="Chức vụ"
                options={[
                  { id: 1, label: 'Quản lý' },
                  { id: 2, label: 'Nhân viên' },
                ]}
                style={{ width: 221 }}
              />
              <TextFieldElement name="password" label="Mật khẩu" type="password" />
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="center" mb={2} mt={5} spacing={5}>
              <Button variant="contained" size="large" type="submit">
                OK
              </Button>
              <ButtonBack />
            </Stack>
          </FormContainer>
        </Card>
      </Container>
    </>
  );
}
