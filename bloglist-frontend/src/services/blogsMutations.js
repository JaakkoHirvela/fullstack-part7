import { useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "./blogs";
import { NotificationType, setNotification, useNotificationDispatch } from "../utils/notificationUtils";
import { useUserValue } from "../components/User/UserContext";

export const useNewBlogMutation = (afterSuccess) => {
  const user = useUserValue();
  const queryClient = useQueryClient();
  const notificationDispatch = useNotificationDispatch();
  return useMutation({
    mutationFn: (newBlog) => blogService.create(newBlog, user.token),
    onSuccess: (data, variables) => {
      const newBlog = variables;
      queryClient.invalidateQueries(["blogs"]);
      setNotification(
        notificationDispatch,
        `A new blog ${newBlog.title} by ${newBlog.author} added`,
        NotificationType.SUCCESS
      );
      afterSuccess();
    },
    onError: (error) => {
      const { error: errorMessage } = error.response.data;
      setNotification(notificationDispatch, `Failed to create blog: ${errorMessage}`, NotificationType.ERROR);
    },
  });
};

export const useLikeBlogMutation = () => {
  const user = useUserValue();
  const queryClient = useQueryClient();
  const notificationDispatch = useNotificationDispatch();
  return useMutation({
    mutationFn: (blog) => blogService.update({ ...blog, likes: blog.likes + 1 }, user.token),
    onSuccess: (data, variables) => {
      const likedBlog = variables;
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((blog) => (blog.id === likedBlog.id ? { ...blog, likes: blog.likes + 1 } : blog))
      );
      setNotification(notificationDispatch, `Blog ${likedBlog.title} liked!`, NotificationType.SUCCESS);
    },
    onError: (error) => {
      const { error: errorMessage } = error.response.data;
      setNotification(notificationDispatch, `Failed to like blog: ${errorMessage}`, NotificationType.ERROR);
    },
  });
};

export const useDeleteBlogMutation = () => {
  const user = useUserValue();
  const queryClient = useQueryClient();
  const notificationDispatch = useNotificationDispatch();
  return useMutation({
    mutationFn: (deletedBlog) => blogService.deleteBlog(deletedBlog.id, user.token),
    onSuccess: (data, variables) => {
      const deletedBlog = variables;
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.filter((blog) => blog.id !== deletedBlog.id)
      );
      setNotification(notificationDispatch, `Blog ${deletedBlog.title} deleted!`, NotificationType.SUCCESS);
    },
    onError: (error) => {
      const { error: errorMessage } = error.response.data;
      setNotification(notificationDispatch, `Failed to delete blog: ${errorMessage}`, NotificationType.ERROR);
    },
  });
};

/*

export const useCommentBlogMutation = () => {
  const queryClient = useQueryClient();
  const notificationDispatch = useNotificationDispatch();
  return useMutation({
    mutationFn: (comment) => blogService.commentBlog(comment.blogId, comment.content),
    onSuccess: (data, variables) => {
      const { blogId, comment } = variables;
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((blog) => (blog.id === blogId ? { ...blog, comments: blog.comments.concat(comment) } : blog))
      );
      setNotification(notificationDispatch, `Comment added!`, NotificationType.SUCCESS);
    },
    onError: (error) => {
      const { error: errorMessage } = error.response.data;
      setNotification(notificationDispatch, `Failed to add comment: ${errorMessage}`, NotificationType.ERROR);
    },
  });
}
*/