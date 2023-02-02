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
import ProductDistilleryForm from './ProductDistilleryForm';
import axiosInstance from '../../../utils/axios';

// ----------------------------------------------------------------------

export default function ProductDistillery() {
  const { themeStretch } = useSettings()
  const [productDistillery, setProductDistillery] = useState({});
  const [selected, setSelected] = useState({
    name: '',
  });

  const getProductDistillery = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/productdistillery')
      setProductDistillery(res?.data)
    } catch (e) {
      console.error(e);
    }
  })

  useEffect(() => {
    getProductDistillery();
  }, []);

  return (
    <Page title="Ecommerce: Create a new auction">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Product Distillery'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Attribute',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'Product Distillery' },
          ]}
        />
        <Grid container>
          <Grid container spacing={3} xs="12" md="7">
            <ProductDistilleryForm currentValue={selected} />
          </Grid>
          <Grid container spacing={3} xs="12" md="5">
            <Autocomplete
              id="tags-standard"
              fullWidth
              options={productDistillery}
              value={selected}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setSelected(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Product Distillery"
                  placeholder="Product Distillery"
                />
              )}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
