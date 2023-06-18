import { Helmet } from 'react-helmet-async';
import { Button, Card, Container, Stack, Typography } from '@mui/material';
import { FormContainer, SelectElement, TextFieldElement } from 'react-hook-form-mui';

import { useEffect, useState } from 'react';
import { axiosClient } from '../utils/axiosClient';
import { ButtonBack } from '../components/button/back-button/ButtonBack';
import { useNavigate } from 'react-router-dom';

export default function CreateProductPage() {
  const [productType, setProductType] = useState([]);
  const [category, setCategory] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const navigate = useNavigate();
  const getTypes = async () => await axiosClient.get('/api/product-types');
  const getCate = async () => await axiosClient.get('/api/categories');

  const getSup = async () => await axiosClient.get('/api/suppliers');

  useEffect(() => {
    getTypes().then((res) =>
      setProductType(res.data.data.filter((t) => t.parent_id !== null).map((t) => ({ id: t.id, label: t.name })))
    );
    getCate().then((res) => setCategory(res.data.data.map((c) => ({ id: c.id, label: c.name }))));
    getSup().then((res) => setSupplier(res.data.data.map((s) => ({ id: s.id, label: s.name }))));
  }, []);

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
              axiosClient
                .post('/api/products', {
                  category_id: data.category,
                  name: data.name,
                  unit_id: data.unit,
                  brand_name: data.brand_name,
                  tax: data.tax,
                })
                .then((res) => {
                  res.message === 'Successful' && navigate(-1);
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
                <SelectElement name="category" label="Loại mặt hàng" options={category} required />
                <SelectElement name="productType" label="Phân loại" options={productType} required />
                <SelectElement name="unit" label="Đơn vị" options={units} required />
              </Stack>

              <Stack direction="column" width={221} spacing={{ xs: 1, sm: 2, md: 4 }}>
                <TextFieldElement name="brand_name" label="Nhãn hiệu" required />
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
