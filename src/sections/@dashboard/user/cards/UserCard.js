import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Avatar, Divider, Typography, Stack } from '@mui/material';
// utils
import cssStyles from '../../../../utils/cssStyles';
// import { fShortenNumber } from '../../../../utils/formatNumber';
// components
import Image from '../../../../components/Image';
import SocialsButton from '../../../../components/SocialsButton';
import SvgIconStyle from '../../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.primary.darker }),
  top: 0,
  zIndex: 8,
  content: "''",
  width: '100%',
  height: '100%',
  position: 'absolute',
}));

// ----------------------------------------------------------------------

UserCard.propTypes = {
  user: PropTypes.object.isRequired,
};

export default function UserCard({ user }) {

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <SvgIconStyle
          src="https://minimal-assets-api.vercel.app/assets/icons/shape-avatar.svg"
          sx={{
            width: 144,
            height: 62,
            zIndex: 10,
            left: 0,
            right: 0,
            bottom: -26,
            mx: 'auto',
            position: 'absolute',
            color: 'background.paper',
          }}
        />
        <Avatar
          alt={user.username}
          src={user.avatar_mb || 'https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg'}
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -32,
            mx: 'auto',
            position: 'absolute',
          }}
        />
        <OverlayStyle />
        <Image src='https://i.pinimg.com/originals/8b/46/01/8b46016b6bc16f50f3fadc13a7afdcef.png' alt={user.avatar_mb} ratio="16/9" />
      </Box>

      <Typography variant="subtitle1" sx={{ mt: 6 }}>
        {`${user.firs_name} ${user.last_name}`}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {user.email}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {user.role}
      </Typography>

      <Stack alignItems="center">
        <SocialsButton initialColor sx={{ my: 2.5 }} />
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {/* <Box sx={{ py: 3, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
            Follower
          </Typography>
          <Typography variant="subtitle1">{fShortenNumber(123456)}</Typography>
        </div>

        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
            Following
          </Typography>
          <Typography variant="subtitle1">{fShortenNumber(123456)}</Typography>
        </div>

        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
            Total Post
          </Typography>
          <Typography variant="subtitle1">{fShortenNumber(123456)}</Typography>
        </div>
      </Box> */}
    </Card>
  );
}
