import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Card, Avatar, Typography, CardContent, Stack, TextField, MenuItem, Button } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// utils
import { fDate } from '../../../utils/formatTime';
// components
import Image from '../../../components/Image';
import TextMaxLine from '../../../components/TextMaxLine';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
  top: 0,
  zIndex: 1,
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.8),
}));

// ----------------------------------------------------------------------

BlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
  onChangeStatus: PropTypes.func,
  onRemove: PropTypes.func,
};

export default function BlogPostCard({ post, index, onChangeStatus, onRemove }) {
  const isDesktop = useResponsive('up', 'md');

  const latestPost = index === 0 || index === 1 || index === 2;
  // const latestPost = null;

  if (isDesktop && latestPost) {
    return (
      <Card>
        <Avatar
          alt={post.user?.username}
          src={post.user?.avatar_mb}
          sx={{
            zIndex: 9,
            top: 24,
            left: 24,
            width: 40,
            height: 40,
            position: 'absolute',
          }}
        />
        <PostContent onRemove={onRemove} idpost={post._id} onChangeStatus={onChangeStatus} status={post.status} title={post.title} view={123} createdAt={post.createdAt} index={index} />
        <OverlayStyle />
        <Image alt="cover" src={post.image} sx={{ height: 360 }} />
      </Card>
    );
  }

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        <SvgIconStyle
          src="https://minimal-assets-api.vercel.app/assets/icons/shape-avatar.svg"
          sx={{
            width: 80,
            height: 36,
            zIndex: 9,
            bottom: -15,
            position: 'absolute',
            color: 'background.paper',
          }}
        />
        <Avatar
          alt={post.user?.username}
          src={post.user?.avatar_mb}
          sx={{
            left: 24,
            zIndex: 9,
            width: 32,
            height: 32,
            bottom: -16,
            position: 'absolute',
          }}
        />
        <Image alt="cover" src={post.image} ratio="4/3" />
      </Box>

      <PostContent onRemove={onRemove} idpost={post._id} onChangeStatus={onChangeStatus} title={post.title} status={post.status} view={123} createdAt={post.createdAt} index={index} />
    </Card>
  );
}

// ----------------------------------------------------------------------

PostContent.propTypes = {
  idpost: PropTypes.string,
  title: PropTypes.string,
  createdAt: PropTypes.string,
  index: PropTypes.number,
  status: PropTypes.string,
  onChangeStatus: PropTypes.func,
  onRemove: PropTypes.func,
};

export function PostContent({ idpost, title, createdAt, index, status, onChangeStatus, onRemove }) {
  const isDesktop = useResponsive('up', 'md');

  const linkTo = `${PATH_DASHBOARD.blog.root}/post/${idpost}`;

  const latestPostLarge = index === 0;
  const latestPostSmall = index === 1 || index === 2;

  return (
    <CardContent
      sx={{
        pt: 4.5,
        width: 1,
        ...((latestPostLarge || latestPostSmall) && {
          pt: 0,
          zIndex: 9,
          bottom: 0,
          position: 'absolute',
          color: 'common.white',
        }),
      }}
    >
      <Typography
        gutterBottom
        variant="caption"
        component="div"
        sx={{
          color: 'text.disabled',
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: 'common.white',
          }),
        }}
      >
        {fDate(createdAt)}
      </Typography>

      <Link to={linkTo} color="inherit" component={RouterLink}>
        <TextMaxLine variant={isDesktop && latestPostLarge ? 'h5' : 'subtitle2'} line={2} persistent>
          {title}
        </TextMaxLine>
      </Link>

      <Stack
        flexWrap="wrap"
        direction="row"
        justifyContent="space-between"
      >
        {/* remove */}
        <Button
          variant="contained"
          size="small"
          onClick={() => onRemove(idpost)}
          sx={{
            height: 40,
            ...((latestPostLarge || latestPostSmall) && {
              bgcolor: 'common.white',
              color: 'text.primary',
            }),
          }}
        >
          Remove
        </Button>
        <TextField
          id="outlined-select-status"
          select
          label="status"
          defaultValue='pending'
          value={status}
          onChange={(e) => onChangeStatus(idpost, e.target.value)}
          sx={{
            width: 100,
            ...((latestPostLarge || latestPostSmall) && {
              color: 'common.white',
              bgcolor: 'common.white',
            }),
          }}
        >
          <MenuItem
            value='active'>
            Active
          </MenuItem>
          <MenuItem value='inactive'>
            Inactive
          </MenuItem>
          <MenuItem value='pending'>
            Pending
          </MenuItem>
        </TextField>
      </Stack>
    </CardContent>
  );
}
