/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { Container, Box } from '@mui/material';
import axiosInstance from '../../utils/axios';
// @mui
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
// import { _userCards } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { UserCard } from '../../sections/@dashboard/user/cards';



// ----------------------------------------------------------------------

export default function UserCards() {
  const { themeStretch } = useSettings();
  const [users, setUsers] = useState([]);

  const getUsers = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/auth/all')
      setUsers(res?.data?.data)
    } catch (e) {
      console.error(e);
    }
  })

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <Page title="User: Cards">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="User Cards"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
          ]}
        />

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
          {/* {_userCards.map((user) => (
            <UserCard key={user.id} user={user} />
          ))} */}
        </Box>
      </Container>
    </Page>
  );
}
