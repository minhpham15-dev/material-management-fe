import React, {useEffect, useState} from 'react';
import {Helmet} from "react-helmet-async";
import {Box, Stack, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import {FormContainer, RadioButtonGroup, TextFieldElement} from "react-hook-form-mui";
import {axiosClient} from "../utils/axiosClient";
import {useForm} from "react-hook-form";
import {getKeyByValue, PaymentMethod} from "../utils/role";

const columns = [
    {field: 'id', headerName: 'ID Sản phẩm', flex: 1},
    {field: 'name', headerName: 'Tên', flex: 1},
    {field: 'amount', headerName: 'Số lượng', flex: 1,},
    {field: 'unit', headerName: 'Đơn vị', flex: 1},
    {field: 'price', headerName: 'Đơn giá', flex: 1},
    {field: 'vat', headerName: 'Thuế', flex: 1},
];
const DetailInvoice = ({data, setOpenModal}) => {
    const [currentSupplier, setCurrentSupplier] = useState(null)
    const [rowData, setRowData] = useState([])
    useEffect(() => {
        axiosClient.get(`/api/invoices/${data}`).then(res => setCurrentSupplier(res.data.data))
    }, [data])
    const formContext = useForm({
        defaultValues: {
            customer_name: currentSupplier?.customer_name || "",
            customer_phone: currentSupplier?.customer_phone || "",
            customer_address: currentSupplier?.customer_address || "",
            payment_method: getKeyByValue(PaymentMethod, currentSupplier?.payment_method) || "",
        }
    });
    useEffect(() => {
        formContext.setValue("customer_name", currentSupplier?.customer_name || "")
        formContext.setValue("customer_phone", currentSupplier?.customer_phone || "")
        formContext.setValue("customer_address", currentSupplier?.customer_address || "")
        formContext.setValue("payment_method", getKeyByValue(PaymentMethod, currentSupplier?.payment_method) || "")
    }, [currentSupplier])
    useEffect(() => {
        if(currentSupplier?.details){
            Promise.all(currentSupplier.details.map( async (v) => {
                const res = await axiosClient.get(`/api/units/${v.commodity.specification.product.unit_id}`);
                return {
                    id: v.commodity.specification.product.id,
                    name: v.commodity.specification.product.name,
                    vat: v.commodity.specification.product.tax,
                    amount: v.commodity.current_amount,
                    price: v.commodity.specification.price,
                    unit: res.data.data.name,
                }
            })).then(res => setRowData(res))
        }
    }, [currentSupplier])
    return (
        <div style={{
            margin: "auto",
            backgroundColor: "white",
            marginTop: "50px",
            marginLeft: "30px",
            marginRight: "30px",
            padding: "14px",
            borderRadius: "5px"
        }}>
            <Helmet>
                <title> Chi tiết hoá đơn bán | Material Management </title>
            </Helmet>
            <Grid container spacing={2}>
                <Grid xs={8}>
                    <>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                            <Typography variant="h4" gutterBottom>
                                Chi tiết hoá đơn bán
                            </Typography>
                        </Stack>
                        <Box sx={{height: 400}}>
                            <DataGrid
                                rows={rowData}
                                columns={columns}
                                pageSizeOptions={[5, 10]}
                                hideFooter={true}
                            />
                        </Box>
                    </>
                </Grid>
                <Grid xs={4}>
                    <FormContainer
                        formContext={formContext}
                    >
                        <TextFieldElement name="customer_name" label="Tên khách hàng" required fullWidth disabled/>
                        <br/>
                        <TextFieldElement name="customer_phone" label="Số ĐT" required fullWidth
                                          style={{marginTop: "14px"}} disabled/><br/>
                        {/*<TextFieldElement name="customer_email" label="Email" required fullWidth*/}
                        {/*                  style={{marginTop: "14px"}}/><br/>*/}
                        <TextFieldElement name="customer_address" label="Địa chỉ" required fullWidth
                                          style={{marginTop: "14px"}} disabled/><br/>
                        <Stack>
                            <RadioButtonGroup
                                label="Phương thức thanh toán"
                                name="payment_method"
                                disabled
                                options={[
                                    {
                                        id: '1',
                                        label: 'Tiền mặt'
                                    },
                                    {
                                        id: '2',
                                        label: 'CK Ngân hàng'
                                    }
                                ]}
                            />
                        </Stack>
                        <h3>Tổng tiền: {currentSupplier?.total ?? "0"}VND</h3>
                    </FormContainer>
                </Grid>
            </Grid>
        </div>
    );
};

export default DetailInvoice;