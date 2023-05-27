import { Helmet } from 'react-helmet-async';
import { Button, Card, Container, Stack, Typography } from '@mui/material';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { useNavigate } from 'react-router-dom';
import {ButtonBack} from "../components/button/back-button/ButtonBack";
import {axiosClient} from "../utils/axiosClient";

export default function CreateSupplierPage() {
  const navigate = useNavigate();

  const onSubmit = (values) => {
    axiosClient.post('/api/suppliers', values).then(res => navigate('/suppliers'));
  }
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
              onSubmit(data);
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
                {/*<TextFieldElement name="address" label="Địa chỉ" required />*/}
                <TextFieldElement name="phone" label="Số điện thoại" required />
              </Stack>

              <Stack
                direction="column"
                alignItems="normal"
                justifyContent="space-around"
                spacing={{ xs: 1, sm: 2, md: 4 }}
              >
                <TextFieldElement name="tax_code" label="Mã số thuế" required />
                <TextFieldElement name="representative" label="Người đại diện" required />
                <TextFieldElement name="representative_phone" label="Số điện thoại người đại diện" required />
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
