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
import ProductClassForm from './ProductClassForm';
import axiosInstance from '../../../utils/axios';

// ----------------------------------------------------------------------

export default function ProductClass() {
  const { themeStretch } = useSettings()
  const [productClass, setProductClass] = useState({});
  const [selected, setSelected] = useState({
    name: '',
  });

  const getProductClass = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/productclass')
      setProductClass(res?.data)
    } catch (e) {
      console.error(e);
    }
  })

  useEffect(() => {
    getProductClass();
  }, []);

  return (
    <Page title="Ecommerce: Create a new auction">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Product Class'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Attribute',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'Product Class' },
          ]}
        />
        <Grid container>
          <Grid container spacing={3} xs="12" md="7">
            <ProductClassForm currentValue={selected} />
          </Grid>
          <Grid container spacing={3} xs="12" md="5">
            <Autocomplete
              id="tags-standard"
              fullWidth
              options={productClass}
              value={selected}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setSelected(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Product Class"
                  placeholder="Product Class"
                />
              )}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
