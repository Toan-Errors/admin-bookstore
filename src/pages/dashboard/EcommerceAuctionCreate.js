import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import AuctionNewForm from '../../sections/@dashboard/e-commerce/AuctionNewForm';
import { getAuctions } from '../../redux/slices/auction';
import { getProducts } from '../../redux/slices/product';

// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { auctions } = useSelector((state) => state.auction);

  const isEdit = pathname.includes('edit');
  const currentAuction = auctions.find((auction) => paramCase(auction._id) === id);

  useEffect(() => {
    dispatch(getAuctions());
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <Page title="Ecommerce: Create a new auction">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new auction' : 'Edit auction'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: !isEdit ? 'Auction' : currentAuction?.auction_name },
          ]}
        />

        <AuctionNewForm isEdit={isEdit} currentAuction={currentAuction} />
      </Container>
    </Page>
  );
}
