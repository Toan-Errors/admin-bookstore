// import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
// import { useTheme } from '@mui/material/styles';
import {
  Card,
  Table,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
// import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
// import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { fDate } from '../../utils/formatTime';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user/list';
import { OrderMoreMenu } from '../../sections/@dashboard/order/list';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from 'src/redux/slices/order';
import { deleteUser } from 'src/redux/slices/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'total_detail', label: 'Total detail', alignRight: false },
  { id: 'shipping_address', label: 'Shipping address', alignRight: false },
  { id: 'create_at', label: 'Create at', alignRight: false },
  // { id: 'points', label: 'Points', alignRight: false },
  // { id: 'isVerified', label: 'Verified', alignRight: false },
  // { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function OrderList() {
  // const theme = useTheme();
  const { themeStretch } = useSettings();

  const orderList = useSelector((state) => state.order.orders) || [];
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('username');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders())
  }, [dispatch])

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (selected.length === orderList.length) {
      setSelected([]);
      return;
    }
    if (checked) {
      const newSelecteds = orderList.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (name) => {
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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteUser = (id) => {
    dispatch(deleteUser(id));
  };

  const handleDeleteMultiUser = (selected) => {
    // const users = orderList.filter((user) => !selected.includes(user._id));
    setSelected([]);
    // dispatch(deleteUsers(users));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orderList.length) : 0;

  const filteredUsers = orderList ? applySortFilter(orderList, getComparator(order, orderBy), filterName) : [];

  const isNotFound = !filteredUsers?.length && Boolean(filterName);

  const handlePrintInvoice = (order) => {
  }

  return (
    <Page title="User: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="User List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.user.newUser}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New User
            </Button>
          }
        />

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteUsers={() => handleDeleteMultiUser(selected)}
          />

          <Scrollbar>
            <TableContainer>
              <Table
                aria-labelledby="tableTitle"
                size="small"
                aria-label="enhanced table"
              >
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={orderList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const isItemSelected = selected.indexOf(row._id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={row._id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(row._id)} />
                        </TableCell>
                        <TableCell sx={{
                          display: 'flex',
                          alignItems: 'center',
                          flexDirection: 'column',
                          justifyContent: 'center'
                        }}>
                          <Avatar alt={row.user._id} src={row?.user.avatar_mb} sx={{ mr: 2 }} />
                          <Typography variant="subtitle2" noWrap>
                            {row.user.first_name + ' ' + (row.user.last_name ? row.user.last_name : '')}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography variant="subtitle2" noWrap>
                            discount: {row.total_details.amount_discount}
                          </Typography>
                          <Typography variant="subtitle2" noWrap>
                            shipping: {row.total_details.amount_shipping}
                          </Typography>
                          <Typography variant="subtitle2" noWrap>
                            tax: {row.total_details.amount_tax}
                          </Typography>
                          <Typography variant="subtitle2" noWrap>
                            total: {row.total_details.amount_discount + row.total_details.amount_shipping + row.total_details.amount_tax}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography variant="subtitle2" noWrap>
                            {row?.shipping_details?.address?.country}
                          </Typography>
                          <Typography variant="subtitle2" noWrap>
                            {row?.shipping_details?.address?.city}
                          </Typography>
                          <Typography variant="subtitle2" noWrap>
                            {row?.shipping_details?.address?.state}
                          </Typography>
                          <Typography variant="subtitle2" noWrap>
                            {row?.shipping_details?.address?.postal_code}
                          </Typography>
                          <Typography variant="subtitle2" noWrap>
                            {row?.shipping_details?.address?.line1}
                          </Typography>
                          <Typography variant="subtitle2" noWrap>
                            {row?.shipping_details?.address?.line2}
                          </Typography>
                        </TableCell>
                        {/* <TableCell align="left">{row?.wallet?.points}</TableCell> */}
                        <TableCell align="left">{fDate(row.createdAt)}</TableCell>
                        {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}
                        {/* <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={(status === 'banned' && 'error') || 'success'}
                          >
                            {sentenceCase(status)}
                          </Label>
                        </TableCell> */}

                        <TableCell align="right">
                          <OrderMoreMenu onDelete={() => handleDeleteUser(row._id)} onInvoice={() => handlePrintInvoice(row)} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
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
            count={orderList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}

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
    return array.filter((_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
