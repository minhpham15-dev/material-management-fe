import React, {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {axiosClient} from "../utils/axiosClient";
import {getKeyByValue, PaymentMethod} from "../utils/role";
import {Helmet} from "react-helmet-async";
import {Box, Button, Grid, Modal, Stack, Typography} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {FormContainer, RadioButtonGroup, SelectElement, TextFieldElement} from "react-hook-form-mui";
import Iconify from "../components/iconify";


const columns = [
    {field: 'id', headerName: 'ID Sản phẩm', flex: 1},
    {field: 'name', headerName: 'Tên', flex: 1},
    {field: 'amount', headerName: 'Số lượng', flex: 1,},
    {field: 'unit', headerName: 'Đơn vị', flex: 1},
    {field: 'price', headerName: 'Đơn giá', flex: 1},
    {field: 'vat', headerName: 'Thuế', flex: 1},
];
const DetailInputInvoice = ({data, setOpenModal}) => {
    const [currentSupplier, setCurrentSupplier] = useState(null)
    const [rowData, setRowData] = useState([])
    useEffect(() => {
        axiosClient.get(`/api/input-invoices/${data}`).then(res => setCurrentSupplier(res.data.data))
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
                <title> Tạo hoá đơn nhập | Material Management </title>
            </Helmet>
            <Grid container spacing={2}>
                <Grid xs={8}>
                    <>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                            <Typography variant="h4" gutterBottom>
                                Tạo hoá đơn nhập
                            </Typography>
                        </Stack>
                        <Box sx={{height: 400}}>
                            <DataGrid
                                rows={rowData}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: {page: 0, pageSize: 5},
                                    },
                                }}
                                pageSizeOptions={[5, 10]}
                                processRowUpdate={newRow => {
                                    const newTotal = newRow.price * newRow.amount + newRow.price * newRow.vat / 100;
                                    const updatedRow = {...newRow, total: newTotal, isNew: false};
                                    setRowData(rowData.map((row) => (row.id === newRow.id ? updatedRow : row)));
                                    return updatedRow;
                                }}
                            />
                        </Box>
                    </>
                </Grid>
                <Grid xs={4}>
                    <FormContainer
                        onSuccess={data => onSubmit(data)}
                    >
                        <SelectElement
                            label="Nhà cung cấp"
                            name="supplier_id"
                            fullWidth
                            options={listSupplier}
                        />
                        <TextFieldElement name="deliver_name" label="Người giao" required fullWidth
                                          style={{marginTop: "14px"}}/><br/>
                        <TextFieldElement name="deliver_phone" label="Số ĐT người giao" required fullWidth
                                          style={{marginTop: "14px", marginBottom: "14px"}}/> <br/>
                        <Stack>
                            <RadioButtonGroup
                                label="Phương thức thanh toán"
                                name="payment_method"
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
                                onChange={(v) => setIsBank(v === "2")}
                            />
                        </Stack>
                        {isBank && <>
                            <TextFieldElement name="supplier_bank" label="Ngân hàng" required={isBank}
                                              fullWidth
                                              style={{marginTop: "14px"}}/> <br/>
                            <TextFieldElement name="supplier_bank_account_number" label="STK NCC" required={isBank}
                                              fullWidth
                                              style={{marginTop: "14px"}}/> <br/>

                        </>
                        }
                        <h3>Tổng tiền: {rowData.reduce((acc, v) => v.total + acc, 0)} VND</h3>
                        <Button type={'submit'} variant={'contained'} color={'primary'} style={{marginTop: "14px"}}>Lưu
                        </Button>
                        <Button variant={'contained'} color={'error'} style={{margin: "14px 0 0 14px"}}>Huỷ bỏ</Button>
                    </FormContainer>
                </Grid>
            </Grid><Helmet>
            <title> Tạo hoá đơn nhập | Material Management </title>
        </Helmet>
            <Modal open={openAdd} children={<InputNewItem onAddNewItem={onAddNewItem}/>}
                   onClose={() => setOpenAdd(!openAdd)}/>
            <Grid container spacing={2}>
                <Grid xs={8}>
                    <>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                            <Typography variant="h4" gutterBottom>
                                Tạo hoá đơn nhập
                            </Typography>
                            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill"/>}
                                    onClick={() => setOpenAdd(!openAdd)}>
                                Thêm sản phẩm
                            </Button>
                        </Stack>
                        <Box sx={{height: 400}}>
                            <DataGrid
                                rows={rowData}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: {page: 0, pageSize: 5},
                                    },
                                }}
                                pageSizeOptions={[5, 10]}
                                processRowUpdate={newRow => {
                                    const newTotal = newRow.price * newRow.amount + newRow.price * newRow.vat / 100;
                                    const updatedRow = {...newRow, total: newTotal, isNew: false};
                                    setRowData(rowData.map((row) => (row.id === newRow.id ? updatedRow : row)));
                                    return updatedRow;
                                }}
                            />
                        </Box>
                    </>
                </Grid>
                <Grid xs={4}>
                    <FormContainer
                        onSuccess={data => onSubmit(data)}
                    >
                        <SelectElement
                            label="Nhà cung cấp"
                            name="supplier_id"
                            fullWidth
                            options={listSupplier}
                        />
                        <TextFieldElement name="deliver_name" label="Người giao" required fullWidth
                                          style={{marginTop: "14px"}}/><br/>
                        <TextFieldElement name="deliver_phone" label="Số ĐT người giao" required fullWidth
                                          style={{marginTop: "14px", marginBottom: "14px"}}/> <br/>
                        <Stack>
                            <RadioButtonGroup
                                label="Phương thức thanh toán"
                                name="payment_method"
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
                                onChange={(v) => setIsBank(v === "2")}
                            />
                        </Stack>
                        {isBank && <>
                            <TextFieldElement name="supplier_bank" label="Ngân hàng" required={isBank}
                                              fullWidth
                                              style={{marginTop: "14px"}}/> <br/>
                            <TextFieldElement name="supplier_bank_account_number" label="STK NCC" required={isBank}
                                              fullWidth
                                              style={{marginTop: "14px"}}/> <br/>

                        </>
                        }
                        <h3>Tổng tiền: {rowData.reduce((acc, v) => v.total + acc, 0)} VND</h3>
                        <Button type={'submit'} variant={'contained'} color={'primary'} style={{marginTop: "14px"}}>Lưu
                        </Button>
                        <Button variant={'contained'} color={'error'} style={{margin: "14px 0 0 14px"}}>Huỷ bỏ</Button>
                    </FormContainer>
                </Grid>
            </Grid>
        </div>
    );
};

export default DetailInputInvoice;