/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
// form
import { Controller, useForm } from 'react-hook-form';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography, Autocomplete, InputAdornment, Chip, TextField } from '@mui/material';
// routes
import axiosInstance from '../../../utils/axios';
import countries from "../../../assets/json/country.json";
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFUploadMultiFile,
} from '../../../components/hook-form';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

ProductNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ProductNewForm({ isEdit, currentProduct }) {
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [lottype, setLotType] = useState([]);
  // const [whiskycategoryType, setWhiskyCategoryType] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [productClasses, setProductClasses] = useState([]);
  const [productRegion, setProductRegion] = useState([]);
  const [productLocation, setProductLocation] = useState([]);
  const [productDistillery, setProductDistillery] = useState([]);
  const [users, setUsers] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const getCategory = useCallback(() => {
    const res = axiosInstance.get(`productcategory`)
    res.then((res) => {
      setCategory(res.data);
    });
  })

  const getLotType = useCallback(() => {
    const res = axiosInstance.get(`lottype`)
    res.then((res) => {
      setLotType(res.data);
    });
  })

  const getProductRegion = useCallback(() => {
    const res = axiosInstance.get(`productregion`)
    res.then((res) => {
      setProductRegion(res.data);
    });
  })

  const getProductLocation = useCallback(() => {
    const res = axiosInstance.get(`productlocation`)
    res.then((res) => {
      setProductLocation(res.data);
    });
  })

  const getProductDistilery = useCallback(() => {
    const res = axiosInstance.get(`productdistillery`)
    res.then((res) => {
      setProductDistillery(res.data);
    });
  })

  // const getWhiskyCategoryType = useCallback(() => {
  //   const res = axiosInstance.get(`whiskycategory`)
  //   res.then((res) => {
  //     setWhiskyCategoryType(res.data.data);
  //   });
  // })

  const getProductType = useCallback(() => {
    const res = axiosInstance.get(`producttype`)
    res.then((res) => {
      setProductTypes(res.data);
    });
  })

  const getProductClass = useCallback(() => {
    const res = axiosInstance.get(`productclass`)
    res.then((res) => {
      setProductClasses(res.data);
    });
  })

  const getUsers = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/auth/all')
      setUsers(res?.data?.data)
    } catch (e) {
      console.error(e);
    }
  })

  useEffect(() => {
    getCategory();
    getLotType();
    // getWhiskyCategoryType();
    getProductType();
    getProductClass();
    getProductRegion();
    getProductLocation();
    getProductDistilery();
    getUsers();
  }, []);

  // const NewProductSchema = Yup.object().shape({
  //   prod_name: Yup.string().required('Name is required'),
  //   prod_description: Yup.string().required('Description is required'),
  //   prod_list_photo: Yup.array().min(1, 'Images is required'),
  //   prod_price: Yup.number().moreThan(0, 'Price should not be $0.00'),
  //   prod_abv_percent: Yup.number().moreThan(0, 'ABV should not be 0%'),
  //   prod_volume: Yup.number().moreThan(0, 'Volume should not be 0ml'),
  //   prod_age: Yup.number().moreThan(0, 'Age should not be 0 years'),
  //   prod_vintage: Yup.number().moreThan(0, 'Vintage should not be 0 years'),
  //   prod_type: Yup.string().required('Type is required'),
  //   prod_class: Yup.string().required('Class is required'),
  //   prod_lot_type: Yup.string().required('Lot Type is required'),
  //   prod_category: Yup.string().required('Category is required'),
  //   prod_country: Yup.string().required('Country is required'),
  //   prod_region: Yup.string().required('Region is required'),
  //   prod_location: Yup.string().required('Location is required'),
  //   prod_distillery: Yup.string().required('Distillery is required'),
  // });

  const defaultValues = useMemo(
    () => ({
      prod_name: currentProduct?.prod_name || '',
      prod_description: currentProduct?.prod_description || '',
      prod_list_photo: currentProduct?.prod_list_photo || [],
      prod_abv_percent: currentProduct?.prod_abv_percent || 0,
      prod_volume: currentProduct?.prod_volume || 0,
      prod_age: currentProduct?.prod_age || 0,
      prod_vintage: currentProduct?.prod_vintage || 0,
      prod_type: currentProduct?.prod_type || 'Shop',
      prod_class: currentProduct?.prod_class || '',
      prod_lot_type: currentProduct?.prod_lot_type || '',
      prod_category: currentProduct?.prod_category || [],
      prod_country: currentProduct?.prod_country || '',
      prod_region: currentProduct?.prod_region || '',
      prod_location_of_bottle: currentProduct?.prod_location_of_bottle || '',
      prod_seller_name: currentProduct?.prod_seller_name || '',
      prod_distillery: currentProduct?.prod_distillery || '',
      prod_price: currentProduct?.prod_price || 0,
      prod_price_sale: currentProduct?.prod_price_sale || 0,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm({
    // resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  const onSubmit = async () => {
    try {
      const data = new FormData();
      data.append('prod_name', getValues('prod_name'));
      data.append('prod_description', getValues('prod_description'));
      data.append('prod_abv_percent', getValues('prod_abv_percent'));
      data.append('prod_volume', getValues('prod_volume'));
      data.append('prod_age', getValues('prod_age'));
      data.append('prod_vintage', getValues('prod_vintage'));
      data.append('prod_type', getValues('prod_type'));
      data.append('prod_class', getValues('prod_class'));
      data.append('prod_lot_type', getValues('prod_lot_type'));
      data.append('prod_category', getValues('prod_category'));
      data.append('prod_country', getValues('prod_country'));
      data.append('prod_region', getValues('prod_region'));
      data.append('prod_location_of_bottle', getValues('prod_location_of_bottle'));
      data.append('prod_seller_name', getValues('prod_seller_name'));
      data.append('prod_distillery', getValues('prod_distillery'));
      data.append('prod_price', getValues('prod_price'));
      data.append('prod_price_sale', getValues('prod_price_sale'));
      if (!isEdit) {
        for (let i = 0; i < getValues('prod_list_photo').length; i += 1) {
          data.append('prod_list_photo', getValues('prod_list_photo')[i]);
        }
        await axiosInstance.post('/product/create', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Token ${localStorage.getItem('accessToken')}`
          },
        });
      } else {
        await axiosInstance.put(`/product/update/${currentProduct?._id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Token ${localStorage.getItem('accessToken')}`
          },
        });
      }
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.eCommerce.list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue(
        'prod_list_photo',
        files
      );
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('prod_list_photo', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.prod_list_photo?.filter((_file) => _file !== file);
    setValue('prod_list_photo', filteredItems);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="prod_name" label="Product Name" />
              <div>
                <LabelStyle>Description</LabelStyle>
                <RHFEditor simple name="prod_description" />
              </div>

              <div>
                <LabelStyle>Images</LabelStyle>
                <RHFUploadMultiFile
                  name="prod_list_photo"
                  showPreview
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <RHFSwitch name="inStock" label="In stock" />

              <Stack spacing={3} mt={2}>

                <RHFSelect name="prod_type" label="Product Type">
                  <option> </option>
                  {productTypes.length > 0 && productTypes.map((item) => (
                    <option key={item._id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </RHFSelect>
                <Controller
                  name="prod_category"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      onChange={(event, newValue) => {
                        return field.onChange(newValue);
                      }}
                      options={category.map((option) => {
                        let data = option.name
                        return data;
                      })}
                      getOptionLabel={(option) => option}
                      renderTags={(value, getTagProps) => {
                        return (
                          value.map((option, index) => (
                            <Chip {...getTagProps({ index })} key={index} size="small" label={option} />
                          )))
                      }
                      }
                      renderInput={(params) => <TextField label="Category" {...params} />}
                    />
                  )}
                />
                {/* <RHFSelect name="prod_category" label="Category">
                  <option></option>
                  {
                    category.length > 0 && category?.map((item) => {
                      if (item.type !== values.prod_type) return null;
                      return (
                        <option key={item._id} value={item.name}>
                          {item.name}
                        </option>
                      )
                    })
                  }
                </RHFSelect> */}
                <Stack direction="row" spacing={2}>
                  <RHFSelect name="prod_class" label="Product Class">
                    <option> </option>
                    {productClasses.length > 0 && productClasses?.map((item) => (
                      <option key={item._id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFSelect name="prod_lot_type" label="Lot Type">
                    <option></option>
                    {lottype.length > 0 && lottype?.map((item) => {
                      if (item.type !== values.prod_type) return null;
                      return (
                        <option key={item._id} value={item.name}>
                          {item.name}
                        </option>
                      )
                    })}
                  </RHFSelect>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <RHFSelect name="prod_country" label="Country">
                    <option></option>
                    {countries.map((item) => (
                      <option key={item.label} value={item.label}>
                        {item.label}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFSelect name="prod_region" label="Region">
                    <option></option>
                    {productRegion.map((item) => (
                      <option key={item._id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </RHFSelect>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <RHFSelect name="prod_location_of_bottle" label="Location of bottle">
                    <option></option>
                    {productLocation.map((item) => (
                      <option key={item._id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFSelect name="prod_seller_name" label="Seller">
                    <option></option>
                    {
                      users.length > 0 &&
                      users.map((item) => (
                        <option key={item._id} value={item.username}>
                          {item.username}
                        </option>
                      ))}
                  </RHFSelect>
                </Stack>
                <RHFSelect name="prod_distillery" label="Distillery">
                  <option></option>
                  {productDistillery.map((item) => (
                    <option key={item._id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </RHFSelect>
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack direction="row" spacing={2}>
                <RHFTextField name="prod_abv_percent" label="ABV %" />
                <RHFTextField name="prod_age" label="Age" />
              </Stack>
              <Stack mt={2} direction="row" spacing={2}>
                <RHFTextField name="prod_volume" label="Volume" />
                <RHFTextField name="prod_vintage" label="Vintage" />
              </Stack>
              <Stack mt={2} spacing={2}>
                <RHFTextField
                  name="prod_price"
                  label="Regular Price"
                  placeholder="0.00"
                  value={getValues('prod_price') === 0 ? '' : getValues('prod_price')}
                  onChange={(event) => setValue('prod_price', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'number',
                  }}
                />

                <RHFTextField
                  name="prod_price_sale"
                  label="Sale Price"
                  placeholder="0.00"
                  value={getValues('prod_price_sale') === 0 ? '' : getValues('prod_price_sale')}
                  onChange={(event) => setValue('prod_price_sale', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'number',
                  }}
                />
              </Stack>

              <RHFSwitch name="taxes" label="Price includes taxes" />
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Create Product' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
