import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
// @mui
import {
  Button,
  Card,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { ButtonAdd } from '../components/button/create-button/ButtonAdd';
import { axiosClient } from '../utils/axiosClient';
import DetailProducts from './DetailProducts';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Tên', alignRight: false },
  { id: 'amount', label: 'Số lượng', alignRight: false },
  { id: 'product_types', label: 'Phân loại', alignRight: false },
  { id: 'tax', label: 'Thuế', alignRight: false },
  { id: 'price', label: 'Đơn giá', alignRight: false },
  { id: 'supplier', label: 'Nhà cung cấp', alignRight: false },
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

export default function ProductsPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const getSuppliers = async (name) =>
    await axiosClient.get(`/api/products?name=${name}&page=${page + 1}&per_page=${rowsPerPage}`);
  const deleteProduct = async (id) => await axiosClient.delete(`api/products/${id}`);

  const handleOpenMenu = (event, id) => {
    setCurrentId(id);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = products.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
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
  useEffect(() => {
    const getData = setTimeout(() => {
      getSuppliers(filterName).then((res) => {
        Promise.all(
          res.data.data.map(async (v) => {
            const res = await axiosClient.get(`/api/products/${v.id}/specifications`);
            return { ...res.data.data[0], ...v };
          })
        ).then((res) => {
          setProducts(res);
        });
        setTotalItem(res.data.meta.total);
      });
    }, 500);
    return () => clearTimeout(getData);
  }, [filterName, openModal, isDelete, page, rowsPerPage]);

  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

  const filteredUsers = applySortFilter(products, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  // useEffect(() => {
  //   !filterName &&
  //     getSuppliers().then((res) => {
  //       Promise.all(
  //         res.data.data.map(async (v) => {
  //           const res = await axiosClient.get(`/api/products/${v.id}/specifications`);
  //           return { ...res.data.data[0], ...v };
  //         })
  //       ).then((res) => {
  //         setProducts(res);
  //       });
  //       setTotalItem(res.data.meta.total);
  //     });
  // }, []);

  const handleDeleteItem = (id) => {
    deleteProduct(id).then((res) => {
      setIsDelete(false);
      handleCloseMenu();
    });
  };
  return (
    <>
      <Helmet>
        <title> Quản lý nguyên vật liệu | Material Management </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Quản lý nguyên vật liệu
          </Typography>
          <ButtonAdd navigateTo="/create-product" />
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
                  rowCount={products.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {products &&
                    products.map((row) => {
                      const { id, name, current_amount, tax, price, brand_name, product_types } = row;
                      const selectedUser = selected.indexOf(name) !== -1;
                      const productName = product_types && product_types[0]?.name;
                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{current_amount}</TableCell>

                          <TableCell align="left">{productName}</TableCell>

                          <TableCell align="left">{tax}</TableCell>

                          <TableCell align="left">{price}</TableCell>

                          <TableCell align="left">{brand_name}</TableCell>

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
                  {/*  <TableRow style={{ height: 53 }}>*/}
                  {/*    <TableCell colSpan={6} />*/}
                  {/*  </TableRow>*/}
                  {/*)}*/}
                </TableBody>

                {!products.length && (
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
                            Không có kết quả cho tìm kiếm &nbsp;
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

          {products.length ? (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalItem}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          ) : null}
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
          <Iconify icon={'eva:eye-fill'} sx={{ mr: 2 }} />
          Xem
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={() => setIsDelete(true)}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Xóa
        </MenuItem>
      </Popover>
      <Modal
        open={openModal}
        children={
          <DetailProducts
            data={products.find((v) => v.id === currentId)}
            setOpenModal={setOpenModal}
            setOpenPopover={setOpen}
          />
        }
        onClose={() => setOpenModal(false)}
      />

      <Dialog
        open={isDelete}
        onClose={() => setIsDelete(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Xóa nguyên vật liệu?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa nguyên vật liệu này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setIsDelete(false)}>
            Quay lại
          </Button>
          <Button variant="contained" onClick={() => handleDeleteItem(currentId)}>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
