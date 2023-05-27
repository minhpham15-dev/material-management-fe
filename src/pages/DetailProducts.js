import React, {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {Button, Card, Container, Stack, Typography} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {axiosClient} from "../utils/axiosClient";

const DetailProducts = ({data, setOpenModal}) => {
    const formContext = useForm({
        defaultValues: {
            name: data?.name || "",
            email: data?.email || "",
            phone: data?.phone || "",
            tax: data?.tax || "",
            brand_name: data?.brand_name || "Nguồn khác",
            category_id: data?.category_id || "",
            current_amount: data?.current_amount || "",
            type: data?.product_types[0].name || "",
            price: data?.price || "",
        }
    });
    const onSubmit = (values) => {
        axiosClient.patch(`/api/products/${data.id}`, values).then(res => setOpenModal(false))
    }
    return <>
        <Container style={{transform: 'translate(0%, 50%)'}}>
            <Card>
                <Stack>
                    <Typography variant="h4" ml={5} mt={2} gutterBottom>
                        Chi tiết Nhà cung cấp
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
                            spacing={{xs: 1, sm: 2, md: 4}}
                        >
                            <TextFieldElement name="name" label="Tên" required/>
                            <TextFieldElement name="category_id" label="Loại mặt hàng" required/>
                            <TextFieldElement name="type" label="Phân loại" required/>
                        </Stack>

                        <Stack
                            direction="column"
                            alignItems="normal"
                            justifyContent="space-around"
                            spacing={{xs: 1, sm: 2, md: 4}}
                        >
                            <TextFieldElement name="brand_name" label="Nhà cung cấp" disabled={true} />
                            <TextFieldElement name="current_amount" label="Số lượng" required disabled={true}/>
                            <TextFieldElement name="tax" label="Thuế" required/>
                            <TextFieldElement name="price" label="Đơn giá"
                                              required/>
                        </Stack>
                    </Stack>
                    <Stack direction="row" alignItems="center" justifyContent="end" mb={2} mt={5} mr={10} spacing={5}>
                        <Button variant="contained" size="large" type="submit"
                                disabled={!formContext.formState.isDirty}>
                            Sửa
                        </Button>
                    </Stack>
                </FormContainer>
            </Card>
        </Container></>
}

export default DetailProducts;