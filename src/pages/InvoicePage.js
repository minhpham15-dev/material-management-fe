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
import TextField from '@mui/material/TextField';
import Iconify from "../components/iconify";

const columns = [
    {field: 'id', headerName: 'STT'},
    {field: 'name', headerName: 'Tên'},
    {field: 'amount', headerName: 'Số lượng', type: 'number'},
    {field: 'currency', headerName: 'Đơn vị'},
    {field: 'vat', headerName: 'Thuế'},
    {field: 'money', headerName: 'Thành tiền'},
    {
        field: "Add",
        renderCell: () => (<div>
                <IconButton><EditIcon/></IconButton>
                <IconButton><DeleteIcon/></IconButton>
            </div>)
    }
];
const InputNewItem = () => (
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
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Tên"
                        type="name"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="amount"
                        label="Số lượng"
                        type="name"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="currency"
                        label="Đơn vị"
                        type="name"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="vat"
                        label="Thuế"
                        type="name"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="money"
                        label="Thành tiền"
                        type="name"
                        fullWidth
                        variant="standard"
                    />
                    <Button>Thêm</Button>
                </div>
            </Box>
        </>
    )
export default function InvoicePage() {
    const [rowData, setRowData] = useState([
        {id: 1, name: 'Snow', firstName: 'Jon', age: 35},
        {id: 2, name: 'Lannister', firstName: 'Cersei', age: 42},
        {id: 3, name: 'Lannister', firstName: 'Jaime', age: 45},
        {id: 4, name: 'Stark', firstName: 'Arya', age: 16},
        {id: 5, name: 'Targaryen', firstName: 'Daenerys', age: null},
        {id: 6, name: 'Melisandre', firstName: null, age: 150},
        {id: 7, name: 'Clifford', firstName: 'Ferrara', age: 44},
        {id: 8, name: 'Frances', firstName: 'Rossini', age: 36},
        {id: 9, name: 'Roxie', firstName: 'Harvey', age: 65},
    ])
    const [openAdd, setOpenAdd] = useState(false)
    return (
        <>
            <Helmet>
                <title> Tạo hoá đơn bán | Material Management </title>
            </Helmet>
            <Modal open={openAdd} children={<InputNewItem/>} onClose={() => setOpenAdd(!openAdd)}/>
            <Container>
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
            </Container>
        </>
    )
}
