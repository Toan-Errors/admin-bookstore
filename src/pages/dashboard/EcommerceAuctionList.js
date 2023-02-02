// import { sentenceCase } from 'change-case';
import { useState, useEffect, Fragment } from 'react';
import { SlArrowUp, SlArrowDown } from 'react-icons/sl'
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
  IconButton,
  Collapse,
  TableHead,
  Checkbox,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getAuctions } from '../../redux/slices/auction';

import { fDate } from '../../utils/formatTime';
// import { fCurrency } from '../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
// import Image from '../../components/Image';
// import Label from '../../components/Label';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  // ProductMoreMenu,
  ProductListHead,
  ProductListToolbar,
} from '../../sections/@dashboard/e-commerce/product-list';
import AuctionMoreMenu from '../../sections/@dashboard/e-commerce/product-list/AuctionMoreMenu';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'arrow', label: '', alignRight: false },
  { id: 'auction_name', label: 'Auction', alignRight: false },
  { id: 'auction_description', label: 'Description', alignRight: false },
  { id: 'auction_end_date', label: 'End date', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

export default function EcommerceAuctionList() {
  const [open, setOpen] = useState('');
  const { themeStretch } = useSettings();
  const [auctionList, setAuctionList] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('createdAt');
  // const theme = useTheme();
  const dispatch = useDispatch();

  const { auctions } = useSelector((state) => state.auction);

  useEffect(() => {
    dispatch(getAuctions());
  }, [dispatch]);

  useEffect(() => {
    if (auctions.length) {
      setAuctionList(auctions);
    }
  }, [auctions]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const selected = auctionList.map((n) => n.auction_name);
      setSelected(selected);
      return;
    }
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
  };

  const handleDeleteProduct = (productId) => {
    const deleteProduct = auctionList.filter((product) => product._id !== productId);
    setSelected([]);
    setAuctionList(deleteProduct);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - auctionList.length) : 0;

  const filteredProducts = applySortFilter(auctionList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredProducts.length && Boolean(filterName);

  return (
    <Page title="Ecommerce: Auction List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Auction List"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Ecommerce' }, { name: 'Auction List' }]}
        />
        <Card>
          <ProductListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          // onDeleteProducts={() => handleDeleteProducts(selected)}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ProductListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={auctionList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const isItemSelected = selected.indexOf(row._id) !== -1;
                    return (
                      <Fragment key={row._id}>
                        <TableRow
                          hover
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={isItemSelected} onClick={() => handleClick(row._id)} />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() => setOpen(row._id === open ? '' : row._id)}
                            >
                              {open === row._id ? <SlArrowUp /> : <SlArrowDown />}
                            </IconButton>
                          </TableCell>
                          <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle2" noWrap>
                              {row.auction_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {row.auction_description}
                          </TableCell>
                          <TableCell style={{ minWidth: 160 }}>{fDate(row.auction_end_date)}</TableCell>
                          <TableCell align="right">
                            <AuctionMoreMenu auctionId={row._id} onDelete={() => handleDeleteProduct(row._id)} />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                            <Collapse in={open === row._id} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                  Product
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Image</TableCell>
                                      <TableCell>Name</TableCell>
                                      <TableCell align="right">Dram Price</TableCell>
                                      <TableCell align="right">Dram Target</TableCell>
                                      <TableCell align="right">Limit Bid</TableCell>
                                      <TableCell align="right">Dram Volume</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {row.products.map((product) => {
                                      const dram = row.list_dram.find((item) => item.product === product._id);
                                      return (
                                        <TableRow key={product._id}>
                                          <TableCell component="th" scope="row">
                                            <img
                                              src={dram.dram_image}
                                              alt={product.prod_name}
                                              style={{ width: "50px" }}
                                            />
                                          </TableCell>
                                          <TableCell>{product.prod_name}</TableCell>
                                          <TableCell align="right">
                                            SGD ${dram.dram_price}
                                          </TableCell>
                                          <TableCell align="right">
                                            {dram.dram_target}
                                          </TableCell>
                                          <TableCell align="right">{dram.limit_bid}</TableCell>
                                          <TableCell align="right">{dram.dram_volume}</TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </Fragment>
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
            count={auctionList.length}
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
    return array.filter((_product) => _product.auction_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  return stabilizedThis.map((el) => el[0]);
}
