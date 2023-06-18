import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Checkbox,
  Container,
  IconButton,
  MenuItem,
  Modal,
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
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import INPUTINVOICELIST from '../_mock/inputInvoice';
import { ButtonAdd } from '../components/button/create-button/ButtonAdd';
import { axiosClient } from '../utils/axiosClient';
import DetailInputInvoice from './DetailInputInvoice';
import { fDate } from '../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'idInvoice', label: 'Mã hóa đơn', alignRight: false },
  { id: 'createdAt', label: 'Ngày tạo', alignRight: false },
  { id: 'supplier', label: 'Nhà cung cấp', alignRight: false },
  { id: 'deliverName', label: 'Người giao hàng', alignRight: false },
  { id: 'paymentMethod', label: 'PTTT', alignRight: false },
  { id: 'total', label: 'Tổng tiền', alignRight: false },
  { id: '' },
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

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function InputInvoiceListPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [totalItem, setTotalItem] = useState(0);
  const [invoiceList, setInvoiceList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [supplierList, setSupplierList] = useState([]);

  const handleOpenMenu = (event, id) => {
    setCurrentId(id);
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

  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelecteds = INPUTINVOICELIST.map((n) => n.name);
  //     setSelected(newSelecteds);
  //     return;
  //   }
  //   setSelected([]);
  // };

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

  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - INPUTINVOICELIST.length) : 0;
  const filteredUsers = applySortFilter(INPUTINVOICELIST, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUsers.length && !!filterName;

  useEffect(() => {
    axiosClient.get(`/api/suppliers`).then((res) => setSupplierList(res.data.data));
  }, []);
  useEffect(() => {
    axiosClient.get(`/api/input-invoices?page=${page + 1}&per_page=${rowsPerPage}`).then((res) => {
      setInvoiceList(res.data.data);
      setTotalItem(res.data.meta.total);
    });
  }, [page, rowsPerPage]);
  return (
    <>
      <Helmet>
        <title> Danh sách hóa đơn nhập | Material Management </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách hóa đơn nhập
          </Typography>
          <ButtonAdd navigateTo="/input-invoice">Tạo hóa đơn nhập</ButtonAdd>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={invoiceList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {invoiceList.map((row) => {
                    const { id, created_at, supplier_id, payment_method, total, deliver_name } = row;
                    const selectedUser = selected.indexOf(id) !== -1;
                    const supplierName = supplierList && supplierList.filter((s) => s.id === supplier_id)[0].name;
                    console.log(created_at);
                    const createdTime = fDate(created_at);
                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, id)} />
                        </TableCell>

                        <TableCell align="left">{id}</TableCell>

                        <TableCell align="left">{createdTime}</TableCell>

                        <TableCell align="left">{supplierName}</TableCell>

                        <TableCell align="left">{deliver_name}</TableCell>

                        <TableCell align="left">{payment_method}</TableCell>

                        <TableCell align="center">{total}</TableCell>

                        {/* <TableCell align="left"> */}
                        {/*  <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label> */}
                        {/* </TableCell> */}

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, id)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {/*{emptyRows > 0 && (*/}
                  {/*  <TableRow style={{ height: 53 * emptyRows }}>*/}
                  {/*    <TableCell colSpan={6} />*/}
                  {/*  </TableRow>*/}
                  {/*)}*/}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Không tìm thấy kết quả
                          </Typography>

                          <Typography variant="body2">
                            Không tìm thấy kết quả cho &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Vui lòng kiểm tra lại các ký tự muốn tìm kiếm.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>
          {!isNotFound && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalItem}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
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
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Xem
        </MenuItem>
        <Modal
          open={openModal}
          children={<DetailInputInvoice data={currentId} setOpenModal={setOpenModal} />}
          onClose={() => setOpenModal(false)}
        />
      </Popover>
    </>
  );
}
