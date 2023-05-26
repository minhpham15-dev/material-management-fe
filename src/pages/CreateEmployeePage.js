import { Helmet } from 'react-helmet-async';
import { Button, Card, Container, Stack, Typography } from '@mui/material';
import { FormContainer, RadioButtonGroup, SelectElement, TextFieldElement } from 'react-hook-form-mui';
import { ButtonBack } from '../components/button/back-button/ButtonBack';

const gender = [
  {
    id: 1,
    label: 'Nam',
  },
  { id: 2, label: 'Nữ' },
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
            defaultValues={{ category: '' }}
          >
            <Stack direction="row" alignItems="flex-start" justifyContent="space-around" mt={5}>
              <Stack
                direction="column"
                alignItems="normal"
                justifyContent="space-between"
                spacing={{ xs: 1, sm: 2, md: 4 }}
              >
                <TextFieldElement name="name" label="Tên nhân viên" required />
                <RadioButtonGroup options={gender} name="isMale" label="Giới tính" row required />
              </Stack>

              <Stack direction="column" width={221}>
                <TextFieldElement name="supplier" label="Nhà cung cấp" required />
              </Stack>
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
