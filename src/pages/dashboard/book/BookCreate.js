import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// hooks
import useSettings from 'src/hooks/useSettings';
// components
import Page from 'src/components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { BookNewForm } from 'src/sections/@dashboard/book';
import { getBooks } from 'src/redux/slices/book';

// ----------------------------------------------------------------------

export default function BookCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { bookId } = useParams();
  const { books } = useSelector((state) => state.book);
  const isEdit = pathname.includes('edit');
  const currentBook = books.find((book) => paramCase(book._id) === bookId);

  useEffect(() => {
    dispatch(getBooks());
  }, [dispatch]);

  return (
    <Page title="Books: Create a new book">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new book' : 'Edit book'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Books',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: !isEdit ? 'New book' : currentBook?.title },
          ]}
        />
        <BookNewForm isEdit={isEdit} currentBook={currentBook} />
      </Container>
    </Page>
  );
}
