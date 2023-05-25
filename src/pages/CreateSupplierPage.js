import { Helmet } from 'react-helmet-async';
import { Button, Card, Container, Stack, Typography } from '@mui/material';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { useNavigate } from 'react-router-dom';

export default function CreateSupplierPage() {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };
  return (
    <>
      <Helmet>
        <title>Thêm mới nhà cung cấp</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Thêm nhà cung cấp
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
                <TextFieldElement name="name" label="Tên nhà cung cấp" required />
                <TextFieldElement name="email" label="Email" required />
                <TextFieldElement name="address" label="Địa chỉ" required />
                <TextFieldElement name="phoneNumber" label="Số điện thoại" required />
              </Stack>

              <Stack
                direction="column"
                alignItems="normal"
                justifyContent="space-around"
                spacing={{ xs: 1, sm: 2, md: 4 }}
              >
                <TextFieldElement name="taxCode" label="Mã số thuế" required />
                <TextFieldElement name="representative" label="Người đại diện" required />
                <TextFieldElement name="representativePhoneNumber" label="Số điện thoại người đại diện" required />
              </Stack>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-around" mb={2} mt={5}>
              <Button variant="contained" size="large" type="submit">
                OK
              </Button>
              <Button variant="contained" size="large" style={{ marginLeft: 10 }} onClick={handleBackClick}>
                Quay lại
              </Button>
            </Stack>
          </FormContainer>
        </Card>
      </Container>
    </>
  );
}
