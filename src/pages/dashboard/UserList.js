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
  TextField,
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
// sections
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../sections/@dashboard/user/list';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, deleteUsers, getUsers } from 'src/redux/slices/user';
import { MenuItem } from '@material-ui/core';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'username', label: 'Username', alignRight: false },
  // { id: 'email', label: 'Email', alignRight: false },
  { id: 'phone', label: 'Phone', alignRight: false },
  { id: 'country', label: 'Country', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: 'balance', label: 'Balance', alignRight: false },
  // { id: 'points', label: 'Points', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  // { id: 'isVerified', label: 'Verified', alignRight: false },
  // { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function UserList() {
  // const theme = useTheme();
  const { themeStretch } = useSettings();

  const userList = useSelector((state) => state.user.users) || [];
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('username');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(getUsers())
  }, [dispatch])

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (selected.length === userList.length) {
      setSelected([]);
      return;
    }
    if (checked) {
      const newSelecteds = userList.map((n) => n._id);
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

  const handleDeleteUser = (userId) => {
    dispatch(deleteUser(userId));
  };

  const handleDeleteMultiUser = (selected) => {
    const users = userList.filter((user) => !selected.includes(user._id));
    setSelected([]);
    dispatch(deleteUsers(users));
  };

  const handleChangeRole = async (role, userId) => {
    try {
      await axiosInstance.patch(`/auth/role/${userId}`, { role });
      dispatch(getUsers())
      enqueueSnackbar('Update success', { variant: 'success' });
    } catch (error) {
      console.error(error);
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = userList ? applySortFilter(userList, getComparator(order, orderBy), filterName) : [];

  const isNotFound = !filteredUsers?.length && Boolean(filterName);

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
                  rowCount={userList.length}
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
                          <Avatar alt={row._id} src={row?.avatar_mb} sx={{ mr: 2 }} />
                          <Typography variant="subtitle2" noWrap>
                            {row.first_name + ' ' + (row.last_name ? row.last_name : '')}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{row.username}</TableCell>
                        {/* <TableCell align="left">{row.email}</TableCell> */}
                        <TableCell align="left">{row.phone_mb}</TableCell>
                        <TableCell align="left">{row.country_mb}</TableCell>
                        <TableCell align="left">{row.delivery_address}</TableCell>
                        <TableCell align="left">{row?.wallet?.balance || 0}</TableCell>
                        {/* <TableCell align="left">{row?.wallet?.points}</TableCell> */}
                        <TableCell align="left">
                          <TextField
                            id="outlined-select-status"
                            select
                            label="status"
                            defaultValue='user'
                            value={row?.role}
                            onChange={(e) => handleChangeRole(e.target.value, row._id)}
                          >
                            <MenuItem value='user'>
                              User
                            </MenuItem>
                            <MenuItem value='admin'>
                              Admin
                            </MenuItem>
                            <MenuItem value='member'>
                              Member
                            </MenuItem>
                            <MenuItem value='banned'>
                              Banned
                            </MenuItem>
                            <MenuItem value='carrier'>
                              Carrier
                            </MenuItem>
                            <MenuItem value='seller'>
                              Seller
                            </MenuItem>
                            <MenuItem value='designer'>
                              Designer
                            </MenuItem>
                          </TextField>
                        </TableCell>
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
                          <UserMoreMenu onDelete={() => handleDeleteUser(row._id)} userName={row.username} />
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
            count={userList.length}
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
