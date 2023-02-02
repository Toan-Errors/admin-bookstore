/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import styled from '@emotion/styled';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import axiosInstance from '../../../utils/axios';
import { FormProvider, RHFEditor, RHFSelect, RHFTextField } from '../../../components/hook-form';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export default function ProductLocationForm({ currentValue }) {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({
    defaultValues: {
      name: currentValue?.name || '',
      description: currentValue?.description || '',
    },
  });

  const {
    // reset,
    // watch,
    // // control,
    // setValue,
    // getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    methods.reset({
      name: currentValue?.name || '',
      description: currentValue?.description || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue]);

  // const navigate = useNavigate();

  const onSubmit = async (data) => {
    await axiosInstance.put(`/productlocation/${currentValue._id}`, data)
      .then((res) => {
        enqueueSnackbar('Update success!');
        window.location.reload();
      })
      .catch((err) => {
        enqueueSnackbar('Update fail!');
      });
  };

  const onRemove = async () => {
    await axiosInstance.delete(`/productlocation/${currentValue._id}`)
      .then((res) => {
        enqueueSnackbar('Remove success!');
        window.location.reload();
      })
      .catch((err) => {
        enqueueSnackbar('Remove fail!');
      });
  };

  const onCreate = async (data) => {
    await axiosInstance.post('/productlocation', data)
      .then((res) => {
        enqueueSnackbar('Create success!');
        window.location.reload();
      })
      .catch((err) => {
        enqueueSnackbar('Create fail!');
      });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <RHFTextField name="name" label="Name" />
          <div>
            <LabelStyle>Description</LabelStyle>
            <RHFEditor simple name="description" />
          </div>
        </Stack>
      </Card>
      <Grid spacing={1} container row xs={12} md={12}>
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              Save Changes
            </LoadingButton>
          </Stack>
        </Grid>
        <Grid item spacing={3} xs={12} md={4}>
          <Stack spacing={3}>
            <LoadingButton onClick={handleSubmit(onRemove)} variant="contained" size="large" loading={isSubmitting}>
              Remove
            </LoadingButton>
          </Stack>
        </Grid>
        <Grid item spacing={3} xs={12} md={4}>
          <Stack spacing={3}>
            <LoadingButton onClick={handleSubmit(onCreate)} variant="contained" size="large" loading={isSubmitting}>
              Create
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>

    </FormProvider>
  );
}
