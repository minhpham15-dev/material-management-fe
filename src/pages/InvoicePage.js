import {
    Autocomplete,
    Box, Button,
    Container, IconButton, Modal,
    Stack, TextField,
    Typography
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React, {useEffect, useState} from "react"
import {Helmet} from "react-helmet-async";
import {DataGrid, GridActionsCellItem} from '@mui/x-data-grid';
import Grid from '@mui/material/Unstable_Grid2';
import {FormContainer, RadioButtonGroup, SelectElement, TextFieldElement} from 'react-hook-form-mui'
import {useNavigate} from "react-router-dom";
import Iconify from "../components/iconify";
import {axiosClient} from "../utils/axiosClient";


// eslint-disable-next-line react/prop-types
const InputNewItem = ({onAddNewItem}) => {
    const getDetail = async (data) => {
        setProductId(data)
        const res = await axiosClient.get(`/api/products/${data}/specifications`)
        setSpecs(res.data.data.map((v) => ({...v, id: v.product_types[0].id, label: v.product_types[0].name})))
    }
    const [specs, setSpecs] = useState([])
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState("")
    const [productId, setProductId] = useState("")
    const getProducts = async (name) => axiosClient.get(`/api/products?name=${name}`)
    useEffect(() => {
        getProducts(search).then(res => setProducts(res.data.data.map((v) => ({...v, label: v.name}))))
    }, [search])
    const onSubmit = (data) => {
        const newSpecs = specs.filter(v => v.id === data.type)[0]
        const newProduct = products.find(v => v.id === productId)
        onAddNewItem({
            id: newSpecs.id,
            name: newSpecs.product.name,
            price: newSpecs.price,
            vat: newSpecs.product.tax,
            unit: newProduct.unit.name,
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
                        <Autocomplete
                            disablePortal
                            onInputChange={(v) => setSearch(v.target.value)}
                            onChange={(e, v) => getDetail(v.id)}
                            options={products}
                            sx={{width: 300}}
                            renderInput={(params) => <TextField {...params} label="Tìm sản phẩm"/>}
                            id={"productId"}
                            style={{width: "100%", marginBottom: 4}}
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

export default function InvoicePage() {
    const [rowData, setRowData] = useState([])
    const [openAdd, setOpenAdd] = useState(false)
    const navigate = useNavigate();

    const handleDeleteClick = (id) => () => {
        setRowData(rowData.filter((row) => row.id !== id));
    };

    const columns = [
        {field: 'id', headerName: 'ID Sản phẩm', flex: 1},
        {field: 'name', headerName: 'Tên', flex: 1},
        {field: 'amount', headerName: 'Số lượng', flex: 1, editable: true},
        {field: 'unit', headerName: 'Đơn vị', flex: 1},
        {field: 'price', headerName: 'Đơn giá', flex: 1},
        {field: 'vat', headerName: 'Thuế', flex: 1},
        {field: 'total', headerName: 'Thành tiền', flex: 1},
        {
            field: "Action",
            type: 'actions',
            flex: 1,
            cellClassName: 'actions',
            getActions: ({ id }) => [
                    <GridActionsCellItem icon={<DeleteIcon/>} label="Xoá" onClick={handleDeleteClick(id)} />
                ],
        }
    ];
    // function makeid(length) {
    //     let result = '';
    //     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     const charactersLength = characters.length;
    //     let counter = 0;
    //     while (counter < length) {
    //         result += characters.charAt(Math.floor(Math.random() * charactersLength));
    //         counter += 1;
    //     }
    //     return result;
    // }

    const onSubmit = (values) => {
        const userData = {
            ...values,
            payment_method: values.payment_method === 1 ? 'Chuyển khoản' : 'Tiền mặt',
            total: rowData.reduce((acc, v) => v.total + acc, 0),
            details: rowData.map((v) => ({specification_id: v.id, amount: v.amount}))
        }
        axiosClient.post("/api/invoices", userData).then(res => console.log("OK"))
    }
    const onAddNewItem = (value) => {
        const newTotal = value.price * value.amount + value.price * value.vat / 100
        setRowData([...rowData, {...value, total: newTotal}])
        setOpenAdd(!openAdd)
    }

    return (
        <>
            <Helmet>
                <title> Tạo hoá đơn bán | Material Management </title>
            </Helmet>
            <Modal open={openAdd} children={<InputNewItem onAddNewItem={onAddNewItem}/>}
                   onClose={() => setOpenAdd(!openAdd)}/>
            <Grid container spacing={2}>
                <Grid xs={8}>
                    <>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                            <Typography variant="h4" gutterBottom>
                                Tạo hoá đơn bán
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
                        <TextFieldElement name="customer_name" label="Tên khách hàng" required fullWidth/> <br/>
                        <TextFieldElement name="customer_phone" label="Số ĐT" required fullWidth
                                          style={{marginTop: "14px"}}/><br/>
                        {/*<TextFieldElement name="customer_email" label="Email" required fullWidth*/}
                        {/*                  style={{marginTop: "14px"}}/><br/>*/}
                        <TextFieldElement name="customer_address" label="Địa chỉ" required fullWidth
                                          style={{marginTop: "14px"}}/><br/>
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
                            />
                        </Stack>
                        <h3>Tổng tiền: {rowData.reduce((acc, v) => v.total + acc, 0)} VND</h3>
                        <Button type={'submit'} variant={'contained'} color={'primary'} style={{marginTop: "14px"}}>Lưu
                        </Button>
                        <Button variant={'contained'} color={'error'} style={{margin: "14px 0 0 14px"}}>Huỷ bỏ</Button>
                    </FormContainer>
                </Grid>
            </Grid>
        </>
    )
}
