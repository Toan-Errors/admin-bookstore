// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Alert, Container, Typography } from '@mui/material';
// routes
// hooks
// import useAuth from '../../hooks/useAuth';
import useResponsive from '../../hooks/useResponsive';
// components
import Page from '../../components/Page';
// sections
import { LoginForm } from '../../sections/auth/login';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

// const HeaderStyle = styled('header')(({ theme }) => ({
//   top: 0,
//   zIndex: 9,
//   lineHeight: 0,
//   width: '100%',
//   display: 'flex',
//   alignItems: 'center',
//   position: 'absolute',
//   padding: theme.spacing(3),
//   justifyContent: 'space-between',
//   [theme.breakpoints.up('md')]: {
//     alignItems: 'flex-start',
//     padding: theme.spacing(7, 5, 0, 7),
//   },
// }));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  // const { method } = useAuth();

  // const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="Login">
      <RootStyle>
        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, This is the admin dashboard
            </Typography>
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Sign in to Whiskyfirst
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>Enter your admin dashboard.</Typography>
              </Box>
            </Stack>

            <Alert severity="info" sx={{ mb: 3 }}>
              You must be the site administrator to access
            </Alert>

            <LoginForm />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
