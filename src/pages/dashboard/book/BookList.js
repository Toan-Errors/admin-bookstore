// import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
// @mui
// import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Table,
  TableRow,
  // Checkbox,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Checkbox,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
// utils
import { fDate } from 'src/utils/formatTime';
import { fCurrencyVND } from 'src/utils/formatNumber';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// hooks
import useSettings from 'src/hooks/useSettings';
// components
import Page from 'src/components/Page';
// import Label from 'src/components/Label';
import Image from 'src/components/Image';
import Scrollbar from 'src/components/Scrollbar';
import SearchNotFound from 'src/components/SearchNotFound';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
// sections
import { getBooks } from 'src/redux/slices/book';
import { BookListToolbar, BookMoreMenu } from 'src/sections/@dashboard/book';
import BookListHead from 'src/sections/@dashboard/book/BookListHead';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Product', alignRight: false },
  { id: 'createdAt', label: 'Create at', alignRight: false },
  { id: 'price', label: 'Price', alignRight: true },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function BookList() {
  const { themeStretch } = useSettings();
  // const theme = useTheme();
  const dispatch = useDispatch();

  const { books } = useSelector((state) => state.book);

  const [bookList, setBookList] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('createdAt');

  useEffect(() => {
    dispatch(getBooks());
  }, [dispatch]);

  useEffect(() => {
    if (books.length) {
      setBookList(books);
    }
  }, [books]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const selected = bookList.map((n) => n._id);
      setSelected(selected);
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
  };

  const handleDeleteProduct = (productId) => {
    const deleteProduct = bookList.filter((product) => product._id !== productId);
    setSelected([]);
    setBookList(deleteProduct);
  };

  const handleDeleteProducts = (selected) => {
    const deleteProducts = bookList.filter((product) => !selected.includes(product._id));
    setSelected([]);
    setBookList(deleteProducts);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bookList.length) : 0;

  const filteredProducts = applySortFilter(bookList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredProducts.length && Boolean(filterName);

  return (
    <Page title="Books: Book List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Book List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Books',
              href: PATH_DASHBOARD.book.root,
            },
            { name: 'Book List' },
          ]}
        />

        <Card>
          <BookListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteProducts={() => handleDeleteProducts(selected)}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <BookListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={bookList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const isItemSelected = selected.indexOf(row?._id) !== -1;
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
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                          <Image
                            disabledEffect
                            alt={row?.title}
                            src={row?.coverImage}
                            sx={{ borderRadius: 1.5, width: 64, height: 64, mr: 2 }}
                          />
                          <Typography variant="subtitle2" noWrap>
                            {row?.title}
                          </Typography>
                        </TableCell>
                        <TableCell style={{ minWidth: 160 }}>{fDate(row?.createdAt)}</TableCell>
                        <TableCell align="right">{fCurrencyVND(row?.price)}đ</TableCell>
                        <TableCell align="right">
                          <BookMoreMenu bookId={row._id} onDelete={() => handleDeleteProduct(row._id)} />
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
                      <TableCell align="center" colSpan={6}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </Box>
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
            count={bookList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, value) => setPage(value)}
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
    return array.filter((_product) => _product.prod_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  return stabilizedThis.map((el) => el[0]);
}
