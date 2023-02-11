import axiosClient from "./axios";

class Users {
  getAll = (key,page,per_page) => {
    const params = {
      q: key,
      page: page,
      per_page: per_page
    };
    const url = `/users`;
    return axiosClient.get(url, { params });
  };
  getUserById = (id) => {
    const url = `/users/{$id}`;
    return axiosClient.get(url);
  };
  like = (values) => {
    const url = `/like`
    return axiosClient.post(url,values)
  }
  unLike = (values) => {
    const url = `/unlike`
    return axiosClient.post(url,values)
  }
}
const user = new Users();
export const users = new Users()
export default user;
