import axiosClient from "./axios";

class Auth {
  login = (values) => {
    const url = `/auth`;
    console.log(values);
    // const params = {
    //   ...values
    // }
    return axiosClient.post(url, values);
  };
  sendValidationCode = (values) => {
    const url = `/validate`;
    const params = values
    return axiosClient.post(url, params)
  };

}
const authentication = new Auth();
export const auth = new Auth()
export default authentication;
