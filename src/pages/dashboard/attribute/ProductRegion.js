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
import ProductRegionForm from './ProductRegionForm';
import axiosInstance from '../../../utils/axios';

// ----------------------------------------------------------------------

export default function ProductRegion() {
  const { themeStretch } = useSettings()
  const [productRegion, setProductRegion] = useState({});
  const [selected, setSelected] = useState({
    name: '',
  });

  const getProductRegion = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/productregion')
      setProductRegion(res?.data)
    } catch (e) {
      console.error(e);
    }
  })

  useEffect(() => {
    getProductRegion();
  }, []);

  return (
    <Page title="Ecommerce: Create a new auction">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Product Region'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Attribute',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'Product Region' },
          ]}
        />
        <Grid container>
          <Grid container spacing={3} xs="12" md="7">
            <ProductRegionForm currentValue={selected} />
          </Grid>
          <Grid container spacing={3} xs="12" md="5">
            <Autocomplete
              id="tags-standard"
              fullWidth
              options={productRegion}
              value={selected}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setSelected(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Product Region"
                  placeholder="Product Region"
                />
              )}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
