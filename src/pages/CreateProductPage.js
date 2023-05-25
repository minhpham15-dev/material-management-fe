import { Helmet } from 'react-helmet-async';
import { Button, Card, Container, Stack, Typography } from '@mui/material';
import { FormContainer, SelectElement, TextFieldElement } from 'react-hook-form-mui';
import { useNavigate } from 'react-router-dom';

export default function CreateProductPage() {
  const navigate = useNavigate();

  const productTypeList = [
    { id: 1, label: 'Tròn' },
    { id: 2, label: 'Chữ Y' },
    { id: 3, label: 'Hộp' },
  ];
  const categoryList = [
    { id: 1, label: 'Sắt' },
    { id: 2, label: 'Nhôm' },
    { id: 3, label: 'Thép' },
  ];
  const handleBackClick = () => {
    navigate(-1);
  };
  return (
    <>
      <Helmet>Thêm mới nguyên vật liệu</Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Thêm mới nguyên vật liệu
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
                <TextFieldElement name="name" label="Tên nguyên vật liệu" required />
                <SelectElement name="category" label="Loại mặt hàng" options={categoryList} required />
                <SelectElement name="productType" label="Phân loại" options={productTypeList} required />
                <TextFieldElement name="tax" label="Thuế(%)" required />
              </Stack>

              <Stack
                direction="column"
                alignItems="normal"
                justifyContent="space-around"
                spacing={{ xs: 1, sm: 2, md: 4 }}
              >
                <TextFieldElement name="taxCode" label="Mã số thuế" required />
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
