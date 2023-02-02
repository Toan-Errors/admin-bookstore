/* eslint-disable react/prop-types */
import { Grid } from '@mui/material';
import React, { useCallback, useMemo, useEffect } from 'react'
import { useForm, } from 'react-hook-form';
import FormProvider from './FormProvider';
import RHFSelect from './RHFSelect';
import RHFTextField from './RHFTextField';
import { RHFUploadSingleFile } from './RHFUpload';

export default function RHFListDram({ isEdit, item }) {

  // const NewDramchema = Yup.object().shape({
  //   name: Yup.string().required('Name is required'),
  //   dram_image: Yup.string().required('Description is required'),
  //   limit_bid: Yup.array().min(1, 'End date is required'),
  //   dram_price: Yup.number().moreThan(0, 'Days prev is required'),
  // });

  const defaultValues = useMemo(
    () => ({
      name: item?.name || '',
      dram_image: item?.dram_image || '',
      limit_bid: item?.limit_bid || 0,
      dram_price: item?.dram_price || 0,
      dram_volume: item?.dram_volume || 0,
      dram_target: item?.dram_target || 0,
      dram_type: item?.dram_type || '',
      dram_status: item?.dram_status || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [item]
  );

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    // watch,
    // control,
    setValue,
    // getValues,
    // handleSubmit,
    // formState: { isSubmitting },
  } = methods;

  // const values = watch();

  useEffect(() => {
    if (isEdit && item) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, item]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(
          'dram_image',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  // const onSubmit = (data) => {
  //   console.log(data);
  // };

  return (
    <FormProvider methods={methods}>
      <div className="auction_card_add">
        <div className="header">
          <h3>{ }</h3>
        </div>
        <Grid className="auction_card_add_image" container>
          <Grid item spacing={3} xs={12} md={12}>
            <RHFUploadSingleFile
              name="dram_image"
              showPreview
              label="Dram Image"
              onDrop={handleDrop}
            />
          </Grid>

        </Grid><Grid item xs={12} md={12}>
          <RHFSelect
            name="dram_type"
            label="Dram Type"
          >
            <option value="Opened">Opened</option>
            <option value="New">New</option>
          </RHFSelect>
        </Grid>
        <Grid container spacing={4}>
          <Grid item spacing={3} xs={12} md={6}>
            <RHFTextField
              name="limit_bid"
              label="Limit Bid"
              type="number"
            />
            <RHFTextField
              name="dram_price"
              label="Dram Price"
              type="number"
            />
          </Grid>
          <Grid spacing={3} item xs={12} md={6}>
            <RHFTextField
              name="dram_volume"
              label="Dram Volume"
              type="number"
            />
            <RHFTextField
              name="dram_target"
              label="Dram Target"
              type="number"
            />
          </Grid>

        </Grid>
      </div>
    </FormProvider>
  )
}
