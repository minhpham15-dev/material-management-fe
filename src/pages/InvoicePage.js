import {
    Box, Button,
    Container, IconButton, Modal,
    Stack,
    Typography
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React, {useState} from "react"
import {Helmet} from "react-helmet-async";
import {DataGrid} from '@mui/x-data-grid';
import Grid from '@mui/material/Unstable_Grid2';
import {FormContainer, TextFieldElement} from 'react-hook-form-mui'
import Iconify from "../components/iconify";
import {axiosClient} from "../utils/axiosClient";

const columns = [
    {field: 'id', headerName: 'STT', flex: 1},
    {field: 'name', headerName: 'Tên', flex: 1},
    {field: 'amount', headerName: 'Số lượng', flex: 1},
    {field: 'currency', headerName: 'Đơn vị', flex: 1},
    {field: 'vat', headerName: 'Thuế', flex: 1},
    {field: 'money', headerName: 'Thành tiền', flex: 1},
    {
        field: "Action",
        renderCell: () => (<div>
            <IconButton><EditIcon/></IconButton>
            <IconButton><DeleteIcon/></IconButton>
        </div>),
        flex: 1
    }
];
// eslint-disable-next-line react/prop-types
const InputNewItem = ({onAddNewItem}) => (
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
                        defaultValues={{name: ''}}
                        onSuccess={data => onAddNewItem(data)}
                    >
                        <TextFieldElement name="name" label="Tên" required fullWidth/> <br/>
                        <TextFieldElement name="amount" label="Số lượng" required fullWidth
                                          style={{marginTop: "14px"}}/><br/>
                        <TextFieldElement name="currency" label="Đơn vị" required fullWidth
                                          style={{marginTop: "14px"}}/><br/>
                        <TextFieldElement name="vat" label="Thuế" required fullWidth style={{marginTop: "14px"}}/> <br/>
                        <TextFieldElement name="money" label="Thành tiền" required fullWidth
                                          style={{marginTop: "14px"}}/>
                        <br/>
                        <Button type={'submit'} variant="contained" fullWidth style={{marginTop: "14px"}}>Thêm</Button>
                    </FormContainer>
                </div>
            </Box>
        </>
    )
export default function InvoicePage() {
    const [rowData, setRowData] = useState([])
    const [openAdd, setOpenAdd] = useState(false)

    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

    const onSubmit = (values) => {
        const userData = {
            ...values,
            "payment_method": "test",
            total: rowData.length,
            details: rowData.map(() => ({specification_id: 1, amount: 3}))
        }
        axiosClient.post("/api/invoices", userData).then(res => console.log(res))
    }
    const onAddNewItem = (value) => {
        setRowData([...rowData, {...value, id: Math.random()}])
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
                            />
                        </Box>
                    </>
                </Grid>
                <Grid xs={4}>
                    <FormContainer
                        defaultValues={{name: ''}}
                        onSuccess={data => onSubmit(data)}
                    >
                        <TextFieldElement name="customer_name" label="Tên khách hàng" required fullWidth/> <br/>
                        <TextFieldElement name="customer_phone" label="Số ĐT" required fullWidth
                                          style={{marginTop: "14px"}}/><br/>
                        <TextFieldElement name="customer_email" label="Email" required fullWidth
                                          style={{marginTop: "14px"}}/><br/>
                        <TextFieldElement name="code" label="Mã hoá đơn" required fullWidth
                                          style={{marginTop: "14px"}}/> <br/>
                        <Button type={'submit'} variant={'contained'} color={'primary'} style={{marginTop: "14px"}}>Lưu
                            và in</Button>
                        <Button variant={'contained'} color={'error'} style={{margin: "14px 0 0 14px"}}>Huỷ bỏ</Button>
                    </FormContainer>
                </Grid>
            </Grid>
        </>
    )
}
