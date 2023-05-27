import {filter} from 'lodash';
import {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {
    Button,
    Card,
    Checkbox,
    Container,
    IconButton,
    MenuItem, Modal,
    Paper,
    Popover,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Typography,
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import SUPPLIERLIST from '../_mock/suppliers';
import Iconify from '../components/iconify';
import {UserListHead, UserListToolbar} from '../sections/@dashboard/user';
import Scrollbar from '../components/scrollbar/Scrollbar';
import {ButtonAdd} from '../components/button/create-button/ButtonAdd';
import async from "async";
import {axiosClient} from "../utils/axiosClient";
import {DetailSupplier} from "./DetailSupplier";

const TABLE_HEAD = [
    {id: 'name', label: 'Tên', alignRight: false},
    {id: 'email', label: 'Email', alignRight: false},
    {id: 'phone', label: 'SĐT', alignRight: false},
    {id: 'tax_code', label: 'Mã số thuế', alignRight: false},
    {id: 'representative', label: 'Người đại diện', alignRight: false},
    {id: 'representative_phone', label: 'SĐT Người đại diện', alignRight: false},
    {id: ''},
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// function applySortFilter(array, comparator, query) {
//     const stabilizedThis = array.map((el, index) => [el, index]);
//     stabilizedThis.sort((a, b) => {
//         const order = comparator(a[0], b[0]);
//         if (order !== 0) return order;
//         return a[1] - b[1];
//     });
//     if (query) {
//         return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
//     }
//     return stabilizedThis.map((el) => el[0]);
// }

export default function SupplierPage() {
    const [open, setOpen] = useState(null);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [suppliers, setSuppliers] = useState([]);

    const [openModal, setOpenModal] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const getSuppliers = async () => await axiosClient.get('/api/suppliers')

    useEffect(() => {
        getSuppliers().then(res => setSuppliers(res.data.data));
    }, [openModal])
    const handleOpenMenu = (event, id) => {
        setCurrentId(id)
        setOpen(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };


    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - suppliers.length) : 0;

    // const filteredUsers = applySortFilter(suppliers, getComparator(order, orderBy), filterName);

    // const isNotFound = !filteredUsers.length && !!filterName;
    return (
        <>
            <Helmet>
                <title> Quản lý nhà cung cấp | Material Management </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Nhà cung cấp
                    </Typography>
                    <ButtonAdd navigateTo="/create-supplier"/>
                </Stack>

                <Card>
                    <UserListToolbar numSelected={selected.length} filterName={filterName}
                                     onFilterName={handleFilterByName}/>

                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={suppliers.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    // onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {suppliers && suppliers.map((row) => {
                                        const {
                                            id,
                                            name,
                                            representative,
                                            tax_code,
                                            email,
                                            representative_phone,
                                            phone
                                        } = row;
                                        const selectedUser = selected.indexOf(name) !== -1;
                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox"
                                                      selected={selectedUser}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={selectedUser}
                                                              onChange={(event) => handleClick(event, name)}/>
                                                </TableCell>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Typography variant="subtitle2" noWrap>
                                                            {name}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{email}</TableCell>

                                                <TableCell align="left">{phone}</TableCell>

                                                <TableCell align="left">{tax_code}</TableCell>

                                                <TableCell align="left">{representative}</TableCell>

                                                <TableCell align="left">{representative_phone}</TableCell>

                                                {/* <TableCell align="left"> */}
                                                {/*  <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label> */}
                                                {/* </TableCell> */}

                                                <TableCell align="right">
                                                    <IconButton size="large" color="inherit"
                                                                onClick={(e) => handleOpenMenu(e, id)}>
                                                        <Iconify icon={'eva:more-vertical-fill'}/>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{height: 53 * emptyRows}}>
                                            <TableCell colSpan={6}/>
                                        </TableRow>
                                    )}
                                </TableBody>

                                {!suppliers.length && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{py: 3}}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h6" paragraph>
                                                        Không tìm thấy dữ liệu
                                                    </Typography>

                                                    <Typography variant="body2">
                                                        Không tìm thấy kết quả cho &nbsp;
                                                        <strong>&quot;{filterName}&quot;</strong>.
                                                        <br/> Vui lòng kiểm tra lại các ký tự hoặc từ muốn tìm kiếm.
                                                    </Typography>
                                                </Paper>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={suppliers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                PaperProps={{
                    sx: {
                        p: 1,
                        width: 140,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <MenuItem onClick={() => setOpenModal(true)}>
                    <Iconify icon={'eva:eye-fill'} sx={{mr: 2}}/>
                    Xem
                </MenuItem>
                <MenuItem sx={{color: 'error.main'}}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{mr: 2}}/>
                    Xoá
                </MenuItem>
            </Popover>

            <Modal open={openModal} children={<DetailSupplier data={currentId} setOpenModal={setOpenModal}/>}
                   onClose={() => setOpenModal(false)}/>
        </>
    );
}
