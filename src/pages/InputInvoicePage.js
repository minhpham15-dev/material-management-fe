import React, {useEffect, useState} from 'react';
import {Helmet} from "react-helmet-async";
import {Box, Button, IconButton, Modal, Stack, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {DataGrid} from "@mui/x-data-grid";
import {FormContainer, RadioButtonGroup, SelectElement, TextFieldElement} from "react-hook-form-mui";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Iconify from "../components/iconify";
import {axiosClient} from "../utils/axiosClient";

const columns = [
    {field: 'id', headerName: 'ID', flex: 1},
    {field: 'name', headerName: 'Tên', flex: 1},
    {field: 'amount', headerName: 'Số lượng', flex: 1, editable: true},
    {field: 'currency', headerName: 'Đơn vị', flex: 1},
    {field: 'vat', headerName: 'Thuế', flex: 1},
    {field: 'price', headerName: 'Đơn giá', flex: 1},
    {field: 'total', headerName: 'Thành tiền', flex: 1},
    {
        field: "Action",
        renderCell: () => (<div>
            <IconButton><EditIcon/></IconButton>
            <IconButton><DeleteIcon/></IconButton>
        </div>),
        flex: 1
    }
];
const InputNewItem = ({onAddNewItem}) => {
    const getDetail = async (data) => {
        const res = await axiosClient.get(`/api/products/${data}/specifications`)
        setSpecs(res.data.data.map((v) => ({...v, id: v.product_types[0].id, label: v.product_types[0].name})))
    }
    const [specs, setSpecs] = useState([])
    const [products, setProducts] = useState([])
    const getProducts = async () => axiosClient.get("/api/products")
    useEffect(() => {
        getProducts().then(res => setProducts(res.data.data.map((v) => ({...v, label: v.name}))))
    }, [])
    const onSubmit = (data) => {
        const newSpecs = specs.filter(v => v.id === data.type)[0]
        const newProduct = products.find(v => v.id === data.productId)
        onAddNewItem({
            id: newSpecs.id,
            name: newSpecs.product.name,
            price: newSpecs.price,
            vat: newSpecs.product.tax,
            currency: newProduct.unit.name,
            amount: 1
        })
    }
    return (
        <>
            <Box style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
            }}>
                <div style={{margin: "auto", backgroundColor: "white", padding: "14px"}}>
                    <FormContainer
                        onSuccess={data => onSubmit(data)}
                    >
                        <SelectElement
                            label="Sản phẩm"
                            name="productId"
                            fullWidth
                            required
                            options={products}
                            onChange={(v) => getDetail(v)}
                        />
                        <SelectElement
                            label="Loại"
                            name="type"
                            fullWidth
                            required
                            options={specs}
                        />
                        <Button type={'submit'} variant="contained" fullWidth style={{marginTop: "14px"}}>Thêm</Button>
                    </FormContainer>
                </div>
            </Box>
        </>
    )
}
const InputInvoicePage = () => {
    const [rowData, setRowData] = useState([])
    const [openAdd, setOpenAdd] = useState(false)
    const [listSupplier, setListSupplier] = useState([])
    const [isBank, setIsBank] = useState(false)
    const onSubmit = (values) => {
        const userData = {
            ...values,
            "payment_method": "test",
            total: rowData.length,
            details: rowData.map(() => ({specification_id: 1, amount: 3}))
        }
        axiosClient.post("/api/input-invoices", userData).then(res => console.log(res))
    }
    const onAddNewItem = (value) => {
        const newTotal = value.price * value.amount + value.price * value.vat / 100
        setRowData([...rowData, {...value, total: newTotal}])
        setOpenAdd(!openAdd)
    }

    useEffect(() => {
        axiosClient.get("/api/suppliers").then(res => {
            setListSupplier(res.data.data.map((v) => ({id: v.id, label: v.name})))
        })
    }, [])

    return <>
        <Helmet>
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
                            // onRowEditStop={(v) => console.log(v)}
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
                    <TextFieldElement name="customer_phone" label="Số ĐT" required fullWidth
                                      style={{marginTop: "14px"}}/><br/>
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
                    {isBank && <><TextFieldElement name="supplier_bank_account_number" label="STK Ncc" required={isBank}
                                                   fullWidth
                                                   style={{marginTop: "14px"}}/> <br/></>
                    }
                    <div>Tổng tiền: {rowData.reduce((acc, v) => v.total + acc,  0)}</div>
                    <Button type={'submit'} variant={'contained'} color={'primary'} style={{marginTop: "14px"}}>Lưu
                        và in</Button>
                    <Button variant={'contained'} color={'error'} style={{margin: "14px 0 0 14px"}}>Huỷ bỏ</Button>
                </FormContainer>
            </Grid>
        </Grid>
    </>
}
export default InputInvoicePage;