import { useQuery } from "@tanstack/react-query";
import blogService from "../services/blogs";
import { useNotificationDispatch, NotificationType, setNotification } from "../utils/notificationUtils";
import { useEffect } from "react";

const useBlogs = () => {
  const notificationDispatch = useNotificationDispatch();
  const query = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    retry: 1,
  });
  const { data: blogs, error, isLoading, isError } = query;

  useEffect(() => {
    if (isLoading) {
      setNotification(notificationDispatch, "Loading blogs...", NotificationType.INFO);
    } else if (isError) {
      setNotification(notificationDispatch, "Failed to load blogs: " + error.message, NotificationType.ERROR);
    } else if (blogs) {
      setNotification(notificationDispatch, "Blogs loaded", NotificationType.SUCCESS);
    }
  }, [isLoading, isError]);

  return blogs;
};

export default useBlogs;
