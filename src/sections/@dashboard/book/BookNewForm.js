/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo } from 'react';
// form
import { Controller, useForm } from 'react-hook-form';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography, InputAdornment, Autocomplete, Chip, TextField } from '@mui/material';
// routes
import countries from "src/assets/json/country.json";
import { PATH_DASHBOARD } from 'src/routes/paths';
// utils
import { fDateTimeISO } from 'src/utils/formatTime';
// components
import {
  FormProvider,
  // RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFUploadMultiFile,
} from 'src/components/hook-form';
import { IMAGE_CDN } from 'src/config';
import axiosInstance from 'src/utils/axios';
import { useDispatch } from 'react-redux';
import { getBooks } from 'src/redux/slices/book';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const genresList = [
  { value: 'Action', label: 'Action' },
  { value: 'Adventure', label: 'Adventure' },
  { value: 'Comedy', label: 'Comedy' },
  { value: 'Crime', label: 'Crime' },
  { value: 'Drama', label: 'Drama' },
  { value: 'Fantasy', label: 'Fantasy' },
  { value: 'Historical', label: 'Historical' },
  { value: 'Historical fiction', label: 'Historical fiction' },
  { value: 'Horror', label: 'Horror' },
  { value: 'Magical realism', label: 'Magical realism' },
  { value: 'Mystery', label: 'Mystery' },
  { value: 'Paranoid fiction', label: 'Paranoid fiction' },
  { value: 'Philosophical', label: 'Philosophical' },
  { value: 'Political', label: 'Political' },
  { value: 'Romance', label: 'Romance' },
  { value: 'Saga', label: 'Saga' },
  { value: 'Satire', label: 'Satire' },
  { value: 'Science fiction', label: 'Science fiction' },
  { value: 'Social', label: 'Social' },
  { value: 'Speculative', label: 'Speculative' },
  { value: 'Thriller', label: 'Thriller' },
  { value: 'Urban', label: 'Urban' },
  { value: 'Western', label: 'Western' }
];

// ----------------------------------------------------------------------

BookNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentBook: PropTypes.object,
};

export default function BookNewForm({ isEdit, currentBook }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

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
      title: currentBook?.title || '',
      subtitle: currentBook?.subtitle || '',
      description: currentBook?.description || '',
      author: currentBook?.author || '',
      publisher: currentBook?.publisher || '',
      pages: currentBook?.pages || 0,
      language: currentBook?.language || '',
      ageGroup: currentBook?.ageGroup || '',
      country: currentBook?.country || 'Vietnam',
      price_sale: currentBook?.price_sale || 0,
      price: currentBook?.price || 0,
      saleDate: fDateTimeISO(currentBook?.saleDate) || fDateTimeISO(new Date()),
      genres: currentBook?.genres || [],
      images: currentBook?.images || [],
    }),
    [currentBook]
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
    if (isEdit && currentBook) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentBook]);

  const onSubmit = async () => {
    try {

      const { images, ...data } = getValues();
      if (images.length === 0) return enqueueSnackbar('Images is required', { variant: 'error' });
      if (images[0].preview) return enqueueSnackbar('Images is required', { variant: 'error' });
      enqueueSnackbar('Loading...', { variant: 'info' });
      const dataSubmit = {
        ...data,
        coverImage: images[0],
        images: images
      };

      if (isEdit) {
        await axiosInstance.put(`/books/${currentBook._id}`, dataSubmit);
      } else {
        await axiosInstance.post('/books', dataSubmit);
      }
      reset();
      dispatch(getBooks());
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
        'images',
        files
      );
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('images', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('images', filteredItems);
  };

  const handleUploadAll = async () => {
    // upload image to cdn server https://cdn.amony.app
    try {
      enqueueSnackbar('Uploading...', { variant: 'info' });
      const formData = new FormData();
      values.images?.forEach((file) => {
        formData.append('image', file);
      });
      // use fetch api to upload image
      const response = await fetch(IMAGE_CDN + '/multiple',
        {
          method: 'POST',
          body: formData,
        });
      const data = await response.json();
      enqueueSnackbar('Upload success!');
      // set image url to form
      const images = data.map((item) => `${IMAGE_CDN}/${item}`);
      setValue('images', images);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="title" label="Title" />
              <RHFTextField name="subtitle" label="Sub title" />
              <div>
                <LabelStyle>Description</LabelStyle>
                <RHFEditor simple name="description" />
              </div>

              <div>
                <LabelStyle>Images</LabelStyle>
                <RHFUploadMultiFile
                  name="images"
                  showPreview
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                  onUploadAll={handleUploadAll}
                />
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              {/* <RHFSwitch name="inStock" label="In stock" /> */}

              <Stack spacing={3} mt={2}>
                <Stack direction="row" spacing={2}>
                  <RHFTextField name="author" label="Author" />
                  <RHFTextField name="publisher" label="Publisher" />
                </Stack>

                <Stack direction="row" spacing={2}>
                  <RHFTextField name="saleDate" label="Sale Date" type='datetime-local' />
                  <RHFTextField name="pages" label="Pages" />
                </Stack>

                <Stack direction="row" spacing={2}>
                  <RHFTextField name="language" label="Language" />
                  <RHFTextField name="ageGroup" label="Age Group" />
                </Stack>

                <Stack direction="row" spacing={2}>
                  <RHFSelect name='country' label='Country'>
                    {countries.map((item) => (
                      <option key={item.label} value={item.label}>
                        {item.label}
                      </option>
                    ))}
                  </RHFSelect>
                </Stack>
                {/* <Stack direction="row" spacing={2}>
                </Stack> */}

                <Controller
                  name="genres"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      onChange={(event, newValue) => {
                        return field.onChange(newValue);
                      }}
                      options={genresList.map((option) => option.label)}
                      getOptionLabel={(option) => option}
                      renderTags={(value, getTagProps) => {
                        return (
                          value.map((option, index) => (
                            <Chip {...getTagProps({ index })} key={index} size="small" label={option} />
                          )))
                      }
                      }
                      renderInput={(params) => <TextField label="Genres" {...params} />}
                    />
                  )}
                />
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack direction="row" spacing={2}>

              </Stack>
              <Stack mt={2} direction="row" spacing={2}>

              </Stack>
              <Stack mt={2} spacing={2}>
                <RHFTextField
                  name="price"
                  label="Regular Price"
                  placeholder="0.00"
                  value={getValues('price') === 0 ? '' : getValues('price')}
                  onChange={(event) => setValue('price', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'number',
                  }}
                />

                <RHFTextField
                  name="price_sale"
                  label="Sale Price"
                  placeholder="0.00"
                  value={getValues('price_sale') === 0 ? '' : getValues('price_sale')}
                  onChange={(event) => setValue('price_sale', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'number',
                  }}
                />
              </Stack>

              {/* <RHFSwitch name="taxes" label="Price includes taxes" /> */}
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
