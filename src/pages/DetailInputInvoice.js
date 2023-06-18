import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { axiosClient } from '../utils/axiosClient';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { FormContainer, RadioButtonGroup, TextFieldElement } from 'react-hook-form-mui';
import { fDate } from '../utils/formatTime';

const columns = [
  { field: 'id', headerName: 'ID Sản phẩm', flex: 1 },
  { field: 'name', headerName: 'Tên', flex: 1 },
  { field: 'amount', headerName: 'Số lượng', flex: 1 },
  { field: 'unit', headerName: 'Đơn vị', flex: 1 },
  { field: 'price', headerName: 'Đơn giá', flex: 1 },
  { field: 'vat', headerName: 'Thuế', flex: 1 },
];
const DetailInputInvoice = ({ data, setOpenModal }) => {
  const [currentSupplier, setCurrentSupplier] = useState(null);
  console.log('currentSupplier', currentSupplier);
  const [rowData, setRowData] = useState([]);
  useEffect(() => {
    axiosClient.get(`/api/input-invoices/${data}`).then((res) => setCurrentSupplier(res.data.data));
  }, [data]);
  const formContext = useForm({
    defaultValues: {
      supplier_id: currentSupplier?.supplier.name || '',
      deliver_name: currentSupplier?.deliver_name || '',
      deliver_phone: currentSupplier?.deliver_phone || '',
      payment_method: currentSupplier?.payment_method || '',
      user: currentSupplier?.user.name || '',
      created_at: fDate(currentSupplier?.created_at) || '',
    },
  });
  useEffect(() => {
    formContext.setValue('supplier_id', currentSupplier?.supplier.name || '');
    formContext.setValue('deliver_name', currentSupplier?.deliver_name || '');
    formContext.setValue('deliver_phone', currentSupplier?.deliver_phone || '');
    formContext.setValue('user', currentSupplier?.user.name || '');
    formContext.setValue('created_at', fDate(currentSupplier?.created_at) || '');
    formContext.setValue('payment_method', currentSupplier?.payment_method === 'Tiền mặt' ? 1 : 2 || '');
  }, [currentSupplier]);
  useEffect(() => {
    if (currentSupplier?.details) {
      Promise.all(
        currentSupplier.details.map(async (v) => {
          const res = await axiosClient.get(`/api/units/${v.commodity.specification.product.unit_id}`);
          return {
            id: v.commodity.specification.product.id,
            name: v.commodity.specification.product.name,
            vat: v.commodity.specification.product.tax,
            amount: v.amount,
            price: v.commodity.specification.price,
            unit: res.data.data.name,
          };
        })
      ).then((res) => setRowData(res));
    }
  }, [currentSupplier]);
  return (
    <div
      style={{
        margin: 'auto',
        backgroundColor: 'white',
        marginTop: '50px',
        marginLeft: '30px',
        marginRight: '30px',
        padding: '14px',
        borderRadius: '5px',
      }}
    >
      <Grid container spacing={2} ml mt>
        <Grid xs={8}>
          <>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h4" gutterBottom>
                Chi tiết hoá đơn nhập
              </Typography>
            </Stack>
            <Box sx={{ height: 400 }}>
              <DataGrid
                rows={rowData}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                hideFooter={true}
              />
            </Box>
          </>
        </Grid>
        <Grid xs={4}>
          <FormContainer formContext={formContext}>
            <TextFieldElement
              name="supplier_id"
              label="Nhà cung cấp"
              required
              fullWidth
              style={{ marginTop: '14px' }}
              disabled
            />
            <br />
            <TextFieldElement
              name="deliver_name"
              label="Người giao"
              required
              fullWidth
              style={{ marginTop: '14px' }}
              disabled
            />
            <br />
            <TextFieldElement
              name="deliver_phone"
              label="Số ĐT người giao"
              required
              fullWidth
              style={{ marginTop: '14px', marginBottom: '14px' }}
              disabled
            />{' '}
            <br />
            <Stack>
              <RadioButtonGroup
                label="Phương thức thanh toán"
                name="payment_method"
                disabled
                options={[
                  {
                    id: 1,
                    label: 'Tiền mặt',
                  },
                  {
                    id: 2,
                    label: 'Chuyển khoản',
                  },
                ]}
              />
            </Stack>
            <h3>Tổng tiền: {currentSupplier?.total} VND</h3>
          </FormContainer>
        </Grid>
        <Grid xs={4} mt={3}>
          <FormContainer formContext={formContext}>
            <Stack spacing={2} direction="row">
              <TextFieldElement name="created_at" label="Ngày tạo" disabled />
              <TextFieldElement name="user" label="Nhân viên nhập hàng" disabled />
            </Stack>
          </FormContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default DetailInputInvoice;
