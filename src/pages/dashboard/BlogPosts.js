import orderBy from 'lodash/orderBy';
import { Link as RouterLink } from 'react-router-dom';
import { useEffect, useCallback, useState } from 'react';
// @mui
import { Grid, Button, Container, Stack } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import useIsMountedRef from '../../hooks/useIsMountedRef';
// utils
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import { SkeletonPostItem } from '../../components/skeleton';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../../sections/@dashboard/blog';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

// ----------------------------------------------------------------------

const applySort = (posts, sortBy) => {
  if (sortBy === 'latest') {
    return orderBy(posts, ['createdAt'], ['desc']);
  }
  if (sortBy === 'oldest') {
    return orderBy(posts, ['createdAt'], ['asc']);
  }
  if (sortBy === 'active') {
    const newPosts = posts.filter((post) => post.status === 'active');
    return orderBy(newPosts, ['createdAt'], ['desc']);
  }
  if (sortBy === 'inactive') {
    const newPosts = posts.filter((post) => post.status === 'inactive');
    return orderBy(newPosts, ['createdAt'], ['desc']);
  }
  if (sortBy === 'pending') {
    const newPosts = posts.filter((post) => post.status === 'pending');
    return orderBy(newPosts, ['createdAt'], ['desc']);
  }
  return posts;
};

export default function BlogPosts() {
  const { themeStretch } = useSettings();

  const isMountedRef = useIsMountedRef();

  const [posts, setPosts] = useState([]);

  const [filters, setFilters] = useState('latest');

  const sortedPosts = applySort(posts, filters);

  const { enqueueSnackbar } = useSnackbar();

  const getAllPosts = useCallback(async () => {
    try {
      const response = await axios.get('/newletter');

      if (isMountedRef.current) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  const handleChangeSort = (value) => {
    if (value) {
      setFilters(value);
    }
  };

  const handleChangeStatus = async (id, status) => {
    try {
      await axios.patch(`/newletter/${id}`, { status });
      getAllPosts();
      enqueueSnackbar('Update success', { variant: 'success' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`/newletter/delete/${id}`);
      getAllPosts();
      enqueueSnackbar('Delete success', { variant: 'success' });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page title="Blog: Posts">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Blog"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Blog', href: PATH_DASHBOARD.blog.root },
            { name: 'Posts' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.blog.newPost}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Post
            </Button>
          }
        />

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch />
          <BlogPostsSort query={filters} options={SORT_OPTIONS} onSort={handleChangeSort} />
        </Stack>

        <Grid container spacing={3}>
          {(!posts.length ? [...Array(12)] : sortedPosts).map((post, index) =>
            post ? (
              <Grid key={post._id} item xs={12} sm={6} md={(index === 0 && 6) || 3}>
                <BlogPostCard onRemove={handleDeletePost} onChangeStatus={handleChangeStatus} post={post} index={index} />
              </Grid>
            ) : (
              <SkeletonPostItem key={index} />
            )
          )}
        </Grid>
      </Container>
    </Page>
  );
}
