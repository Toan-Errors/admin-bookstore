import PropTypes from 'prop-types';
// @mui
import { Box, List } from '@mui/material';
//
import BlogPostCommentItem from './BlogPostCommentItem';

// ----------------------------------------------------------------------

BlogPostCommentList.propTypes = {
  comments: PropTypes.array.isRequired
};

export default function BlogPostCommentList({ comments }) {
  return (
    <List disablePadding>
      {comments.map((comment) => {
        const { _id: id, content, user, subcomments: replyComment, createdAt: postedAt } = comment;
        const hasReply = replyComment.length > 0;

        return (
          <Box key={id} sx={{}}>
            <BlogPostCommentItem
              name={user.username}
              avatarUrl={user.avatar_mb}
              postedAt={postedAt}
              message={content}
            />
            {hasReply &&
              replyComment.map((reply) => {
                const { _id: id, content: message, user, createdAt: postedAt } = reply;
                return (
                  <BlogPostCommentItem
                    key={id}
                    message={message}
                    // tagUser={}
                    postedAt={postedAt}
                    name={user.username}
                    avatarUrl={user.avatar_mb}
                    hasReply
                  />
                );
              })}
          </Box>
        );
      })}
    </List>
  );
}
