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
import ProductLocationForm from './ProductLocationForm';
import axiosInstance from '../../../utils/axios';

// ----------------------------------------------------------------------

export default function ProductLocation() {
  const { themeStretch } = useSettings()
  const [productLocation, setProductLocation] = useState({});
  const [selected, setSelected] = useState({
    name: '',
  });

  const getProductLocation = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/productlocation')
      setProductLocation(res?.data)
    } catch (e) {
      console.error(e);
    }
  })

  useEffect(() => {
    getProductLocation();
  }, []);

  return (
    <Page title="Ecommerce: Create a new auction">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Product Location'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Attribute',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'Product Location' },
          ]}
        />
        <Grid container>
          <Grid container spacing={3} xs="12" md="7">
            <ProductLocationForm currentValue={selected} />
          </Grid>
          <Grid container spacing={3} xs="12" md="5">
            <Autocomplete
              id="tags-standard"
              fullWidth
              options={productLocation}
              value={selected}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setSelected(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Product Location"
                  placeholder="Product Location"
                />
              )}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
