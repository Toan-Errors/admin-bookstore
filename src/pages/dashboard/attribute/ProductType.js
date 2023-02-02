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
import axiosInstance from '../../../utils/axios';
import ProductTypeForm from './ProductTypeForm';

// ----------------------------------------------------------------------

export default function ProductType() {
  const { themeStretch } = useSettings()
  const [productType, setProductType] = useState({});
  const [selected, setSelected] = useState({
    name: '',
  });

  const getProductType = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/producttype')
      setProductType(res?.data)
    } catch (e) {
      console.error(e);
    }
  })

  useEffect(() => {
    getProductType();
  }, []);

  return (
    <Page title="Attribute: Product Type">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Product Type'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Attribute',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'Product Type' },
          ]}
        />
        <Grid container>
          <Grid container spacing={3} xs="12" md="7">
            <ProductTypeForm currentValue={selected} />
          </Grid>
          <Grid container spacing={3} xs="12" md="5">
            <Autocomplete
              id="tags-standard"
              fullWidth
              options={productType}
              value={selected}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setSelected(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Product Type"
                  placeholder="Product Type"
                />
              )}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
