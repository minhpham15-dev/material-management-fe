import { Helmet } from 'react-helmet-async';
import { Button, Card, Container, Stack, Typography } from '@mui/material';
import { FormContainer, SelectElement, TextFieldElement } from 'react-hook-form-mui';

import { useEffect, useState } from 'react';
import { axiosClient } from '../utils/axiosClient';
import { ButtonBack } from '../components/button/back-button/ButtonBack';

export default function CreateProductPage() {
  const productTypeList = [
    { id: 1, label: 'Hộp' },
    { id: 2, label: 'Tròn đặc' },
    { id: 3, label: 'Chữ H' },
  ];
  const categoryList = [
    { id: 1, label: 'Sắt' },
    { id: 2, label: 'Nhôm' },
    { id: 3, label: 'Thép' },
  ];
  const filterOptions = SUPPLIERLIST.map((sup) => ({ id: sup.id, label: sup.name }));
  const [units, setUnits] = useState([]);
  useEffect(() => {
    axiosClient.get('/api/units').then((res) =>
      setUnits(
        res.data.data
          .filter((u) => u.parent_id !== null)
          .map((u) => ({
            id: u.id,
            label: u.name,
          }))
      )
    );
  }, []);
  console.log(units);
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
              axiosClient.post('/api/products', {
                category_id: data.category,
                name: data.name,
                unit_id: data.unit,
                brand_name: data.supplier,
                tax: data.tax,
              });
            }}
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
                <SelectElement name="unit" label="Đơn vị" options={units} required />
              </Stack>

              <Stack direction="column" width={221} spacing={{ xs: 1, sm: 2, md: 4 }}>
                <SelectElement name="supplier" label="Nhà cung cấp" required options={filterOptions} />
                <TextFieldElement name="tax" label="Thuế(%)" required />
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
