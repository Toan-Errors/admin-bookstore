/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
// @mui
import { Autocomplete, Container, Grid, TextField } from '@mui/material';
// redux
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import ProductCategoryForm from './ProductCategoryForm';
import axiosInstance from '../../../utils/axios';

// ----------------------------------------------------------------------

export default function ProductCategory() {
  const { themeStretch } = useSettings()
  const [productCategory, setProductCategory] = useState([]);
  const [productType, setProductType] = useState([]);
  const [selected, setSelected] = useState({
    name: '',
  });

  const getProductCategory = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/productcategory')
      setProductCategory(res?.data)
    } catch (e) {
      console.error(e);
    }
  })

  const getProductType = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/producttype')
      setProductType(res?.data)
    } catch (e) {
      console.error(e);
    }
  })

  useEffect(() => {
    getProductCategory();
    getProductType();
  }, []);

  return (
    <Page title="Ecommerce: Create a new auction">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Product Category'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Attribute',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'Product Category' },
          ]}
        />
        <Grid container>
          <Grid container spacing={3} xs="12" md="7">
            <ProductCategoryForm productType={productType} currentValue={selected} />
          </Grid>
          <Grid container spacing={3} xs="12" md="5">
            <Autocomplete
              id="tags-standard"
              fullWidth
              options={productCategory.sort((a, b) => -b.type.localeCompare(a.type))}
              groupBy={(option) => option.type}
              value={selected}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setSelected(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Product Category"
                  placeholder="Product Category"
                />
              )}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
