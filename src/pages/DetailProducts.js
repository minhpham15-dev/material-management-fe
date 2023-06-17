import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Card, Container, Stack, Typography } from '@mui/material';
import { FormContainer, SelectElement, TextFieldElement } from 'react-hook-form-mui';
import { axiosClient } from '../utils/axiosClient';

const DetailProducts = ({ data, setOpenModal, setOpenPopover }) => {
  const [unit, setUnit] = useState([]);
  const [category, setCategory] = useState([]);
  const getUnit = async () => await axiosClient.get('api/units');
  const getCate = async () => await axiosClient.get('/api/categories');

  const formContext = useForm({
    defaultValues: {
      name: data?.name || '',
      tax: data?.tax || '',
      brand_name: data?.brand_name || 'Nguồn khác',
      category_id: data?.category_id || '',
      current_amount: data?.current_amount || '',
      type: data?.product_types[0].name || '',
      price: data?.price || '',
      unit_id: data?.unit_id || '',
    },
  });

  useEffect(() => {
    getUnit().then((res) =>
      setUnit(
        res.data.data
          .filter((u) => u.parent_id !== null)
          .map((u) => ({
            id: u.id,
            label: u.name,
          }))
      )
    );
    getCate().then((res) => setCategory(res.data.data.map((c) => ({ id: c.id, label: c.name }))));
  }, []);
  const onSubmit = (values) => {
    console.log(values);
    axiosClient.patch(`/api/products/${data.id}`, values).then((res) => {
      setOpenModal(false);
      setOpenPopover(false);
    });
  };
  return (
    <>
      <Container style={{ transform: 'translate(0%, 30%)' }}>
        <Card>
          <Stack>
            <Typography variant="h4" ml={5} mt={2} gutterBottom>
              Chi tiết Nguyên vật liệu
            </Typography>
          </Stack>
          <FormContainer
            formContext={formContext}
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
                <TextFieldElement name="name" label="Tên" required />
                <SelectElement name="category_id" label="Loại mặt hàng" options={category} required />
                <TextFieldElement name="type" label="Phân loại" required />
                <SelectElement name="unit_id" label="Đơn vị tính" options={unit} required />
              </Stack>

              <Stack
                direction="column"
                alignItems="normal"
                justifyContent="space-around"
                spacing={{ xs: 1, sm: 2, md: 4 }}
              >
                <TextFieldElement name="brand_name" label="Nhãn hiệu" required />
                <TextFieldElement name="current_amount" label="Số lượng" disabled={true} />
                <TextFieldElement name="tax" label="Thuế" required />
                <TextFieldElement name="price" label="Đơn giá" disabled={true} />
              </Stack>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="end" mb={2} mt={5} mr={10} spacing={5}>
              <Button variant="contained" size="large" type="submit" disabled={!formContext.formState.isDirty}>
                Sửa
              </Button>
              <Button variant="contained" size="large" onClick={() => setOpenModal(false)}>
                Quay lại
              </Button>
            </Stack>
          </FormContainer>
        </Card>
      </Container>
    </>
  );
};

export default DetailProducts;
