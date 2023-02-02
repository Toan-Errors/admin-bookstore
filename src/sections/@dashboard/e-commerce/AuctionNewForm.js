/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo } from 'react';
// form
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography, Autocomplete, Chip, TextField } from '@mui/material';
// routes
import { useSelector } from 'react-redux';
import axiosInstance from '../../../utils/axios';
// components
import {
  FormProvider,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFUploadSingleFile,
} from '../../../components/hook-form';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

AuctionNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentAuction: PropTypes.object,
};

export default function AuctionNewForm({ isEdit, currentAuction }) {
  const { products } = useSelector((state) => state.product);

  const { enqueueSnackbar } = useSnackbar();

  const formatDateTime = (dateTime) => {
    const optionsTime = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    const formatted = dateTime.toLocaleString('en-US', optionsTime);
    return formatted.slice(0, 19);
  }

  const NewAuctionSchema = Yup.object().shape({
    auction_name: Yup.string().required('Name is required'),
    auction_description: Yup.string().required('Description is required'),
    daysprev: Yup.number().moreThan(0, 'Days prev is required'),
  });

  const defaultValues = useMemo(
    () => ({
      auction_name: currentAuction?.auction_name || '',
      auction_description: currentAuction?.auction_description || '',
      auction_end_date: currentAuction ? formatDateTime(currentAuction?.auction_end_date) : formatDateTime(new Date()),
      daysprev: currentAuction?.daysprev || 0,
      list_dram: currentAuction?.list_dram || [],
      select_dram: [],
    }),
    [currentAuction]
  );

  const methods = useForm({
    resolver: yupResolver(NewAuctionSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    watch,
    // getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const { fields, append } = useFieldArray({
    control,
    name: 'list_dram',
  });

  useEffect(() => {
    setValue('select_dram', fields);
  }, [fields, setValue]);

  useEffect(() => {
    const select_dram = values.select_dram;
    if (select_dram.length > 0) {
      select_dram.forEach((item, index) => {
        const product = fields.find((product) => product.product === item.product);
        if (!product) {
          append({
            product: item.product,
            name: item.name,
          });
        }
      });
    }
  }, [values.select_dram]);

  useEffect(() => {
    if (isEdit && currentAuction) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentAuction, reset, defaultValues]);

  const onSubmit = async (data) => {
    if (data.list_dram.length === 0) {
      enqueueSnackbar('Please select dram', { variant: 'error' });
      return;
    }
    const fdata = new FormData();
    fdata.append('auction_name', data.auction_name);
    fdata.append('auction_description', data.auction_description);
    fdata.append('auction_end_date', data.auction_end_date);
    fdata.append('daysprev', data.daysprev);
    fdata.append('list_dram', JSON.stringify(data.list_dram));
    for (let i = 0; i < data.list_dram.length; i++) {
      fdata.append('dram_image', data.list_dram[i].dram_image.file);
    }
    try {
      if (isEdit) {
        await axiosInstance.put(`/auction/update/${currentAuction._id}`, fdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Token ${localStorage.getItem('accessToken')}`
          },
        });
        enqueueSnackbar('Update auction successfully', { variant: 'success' });
      } else {
        await axiosInstance.post('/auction/create', fdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Token ${localStorage.getItem('accessToken')}`
          },
        });
        enqueueSnackbar('Create auction successfully', { variant: 'success' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Stack spacing={3}>
            <RHFTextField name="auction_name" label="Auction Name" />
            <Grid>
              <LabelStyle>Description</LabelStyle>
              <RHFEditor simple name="auction_description" />
            </Grid>
            {
              fields.length > 0 &&
              fields.map((item, index) => {
                return (
                  <Grid container key={item._id}>
                    <Grid>
                      <LabelStyle>{item.name}</LabelStyle>
                    </Grid>
                    <Grid item spacing={3} xs={12} md={12}>
                      <RHFUploadSingleFile
                        name={`list_dram.${index}.dram_image`}
                        showPreview
                        label="Dram Image"
                        onDrop={(acceptedFiles) => {
                          const file = acceptedFiles[0];
                          if (file) {
                            setValue(
                              `list_dram.${index}.dram_image`,
                              {
                                file,
                                preview: URL.createObjectURL(file),
                              },
                            );
                          }
                        }}
                      />
                    </Grid>
                    <Grid mt={2} item xs={12} md={12}>
                      <RHFSelect
                        name={`list_dram.${index}.dram_type`}
                        label="Dram Type"
                      >
                        <option value="Opened">Opened</option>
                        <option value="New">New</option>
                      </RHFSelect>
                    </Grid>
                    <Grid mt={2} xs={12} md={6}>
                      <RHFTextField
                        name={`list_dram.${index}.limit_bid`}
                        label="Limit Bid"
                        type="number"
                      />
                      <RHFTextField
                        name={`list_dram.${index}.dram_price`}
                        label="Dram Price"
                        type="number"
                      />
                    </Grid>
                    <Grid mt={2} xs={12} md={6}>
                      <RHFTextField
                        name={`list_dram.${index}.dram_volume`}
                        label="Dram Volume"
                        type="number"
                      />
                      <RHFTextField
                        name={`list_dram.${index}.dram_target`}
                        label="Dram Target"
                        type="number"
                      />
                    </Grid>
                  </Grid>
                )
              })
            }
          </Stack>
        </Grid>

        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <RHFTextField name="auction_end_date" label="Auction End Date" type="datetime-local" />
              </Stack>
              <Stack spacing={3} mb={2}>
                <RHFTextField name="daysprev" label="Days Prev" type="number" />
              </Stack>
              <Stack spacing={3} mb={2}>
                <Controller
                  name="select_dram"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      onChange={(event, newValue) => {
                        return field.onChange(newValue);
                      }}
                      options={products.map((option) => {
                        let data = {
                          product: option._id,
                          name: option.prod_name,
                          dram_image: option.avatar_photo_prod,
                          dram_type: 'Opened',
                          limit_bid: 0,
                          dram_price: 0,
                          dram_volume: 0,
                          dram_target: 0,
                        }
                        return data;
                      })}
                      getOptionLabel={(option) => option.name}
                      renderTags={(value, getTagProps) => {
                        return (
                          value.map((option, index) => (
                            <Chip {...getTagProps({ index })} key={option.id} size="small" label={option.name} />
                          )))
                      }
                      }
                      renderInput={(params) => <TextField label="Dram" {...params} />}
                    />
                  )}
                />
              </Stack>
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
