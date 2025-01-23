import axios from "axios";
const baseUrl = "/api/blogs";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newBlog, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(baseUrl, newBlog, config);
  return response;
};

const update = async (updatedBlog, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  // The backend expects the user field to just be an id.
  updatedBlog.user = updatedBlog.user.id;
  const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog, config);
  return response;
};

const deleteBlog = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response;
};

const commentBlog = async (blogId, comment) => {
  const response = await axios.post(`${baseUrl}/${blogId}/comments`, { comment });
  return response;
};

export default { getAll, create, update, deleteBlog, commentBlog };
