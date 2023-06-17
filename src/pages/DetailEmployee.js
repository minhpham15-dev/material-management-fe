import React, { useEffect, useState } from 'react';
import { axiosClient } from '../utils/axiosClient';
import { useForm } from 'react-hook-form';
import { Avatar, Button, Card, Container, Stack, Typography } from '@mui/material';
import { DatePickerElement, FormContainer, SelectElement, TextFieldElement } from 'react-hook-form-mui';
import dayjs from 'dayjs';
import { fDate } from '../utils/formatTime';

// export const genderConfig = {
//   Nam: 1,
//   Nữ: 0,
// };
export const DetailEmployee = ({ data, setOpenModal, setOpenPopover }) => {
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [upload, setUpload] = useState(null);
  const onSubmit = (values) => {
    const formSubmit = {
      ...values,
      date_of_birth: fDate(values.date_of_birth, 'yyyy-MM-dd'),
      is_male: values.is_male === 1,
    };
    // console.log(formSubmit);
    axiosClient.patch(`/api/users/${data}`, formSubmit).then((res) => {
      setOpenModal(false);
      setOpenPopover(false);
    });
  };
  useEffect(() => {
    axiosClient.get(`/api/users/${data}`).then((res) => setCurrentEmployee(res.data.data));
  }, [data]);
  const formContext = useForm({
    defaultValues: {
      name: currentEmployee?.name || '',
      email: currentEmployee?.email || '',
      phone: currentEmployee?.phone || '',
      date_of_birth: currentEmployee?.date_of_birth || '',
      address: currentEmployee?.address || '',
      role: currentEmployee?.role || '',
      is_male: currentEmployee?.is_male ? 1 : 2 || '',
    },
  });
  useEffect(() => {
    formContext.setValue('name', currentEmployee?.name || '');
    formContext.setValue('email', currentEmployee?.email || '');
    formContext.setValue('phone', currentEmployee?.phone || '');
    formContext.setValue('date_of_birth', dayjs(currentEmployee?.date_of_birth ?? new Date()) || '');
    formContext.setValue('address', currentEmployee?.address || '');
    formContext.setValue('role', currentEmployee?.role || '');
    formContext.setValue('is_male', currentEmployee?.is_male ? 1 : 2 || '');
  }, [currentEmployee]);
  return (
    <>
      <Container style={{ transform: 'translate(0%, 30%)' }}>
        <Card>
          <Stack>
            <Typography variant="h4" ml={5} mt={2} gutterBottom>
              Chi tiết Nhân viên
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
                <TextFieldElement name="name" label="Tên nhân viên" required />
                <SelectElement
                  options={[
                    {
                      id: 1,
                      label: 'Nam',
                    },
                    { id: 2, label: 'Nữ' },
                  ]}
                  name="is_male"
                  label="Giới tính"
                  required
                />
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
                <TextFieldElement name="avatar" type="file" onChange={(e) => setUpload(e.target.files[0])} />
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
                <Avatar src={currentEmployee?.avatar} style={{ width: 120, height: 120 }} />
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
