import { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';

import authApi from "../../apis/auth";
import { AppContext } from '../../AppProvider';

export default function Index() {
  const { setUser } = useContext(AppContext);
  let navigate = useNavigate();
  const [phone, setPhone] = useState('+84927094946');
  const [isLogin, setLogin] = useState();
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(false);
  const handlePhoneChange = (newPhone) => {
    setPhone(newPhone)
  }
  const handleTokenChange = (newToken) => {
    console.log(newToken);
    setToken(newToken.target.value)
  }
  const handlePhoneField = () => {
    if (matchIsValidTel(phone)) {
      setLoading(true)
      login();
      setTimeout(() => setLoading(false), 2000)
    } else {
      alert('wrong number format')
    }
  }
  const handleCodeField = () => {
    if (token.toString().match(`^[0-9]{6}$`)) {
      setLoading(true)
      validate();
      setTimeout(() => setLoading(false), 2000)
    } else {
      alert('your validation code is wrong format')
    }
  }
  async function login() {
    try {
      const res = await authApi.login({ phoneNumber: phone.trim().replaceAll(" ", '').slice(1) });
      console.log("islogin", res);
      // setToken(res.data.token);
      setLogin(true);
    }
    catch (err) {
      console.log(err)
    }
  }
  async function validate() {
    try {
      console.log(phone,token);
      const res = await authApi.sendValidationCode({ phoneNumber: phone.trim().replaceAll(" ", '').slice(1), accessCode: token });
      console.log("islogin", res);
      if(res.status === '200'){
        setUser(res.data);
        return navigate("/");
      }
    }
    catch (err) {
      console.log(err);
    }
  }
  return (
    <div className='main'>
      <h1>
        Github project searching tool
      </h1>
      <div className="phone_field">
        {
          isLogin ?
            <>
              <TextField
                id="outlined-password-input"
                label="Your code"
                type="text"
                autoComplete="Fill your code here"
                onChange={handleTokenChange}
              />
              <br />
              <br />
              <LoadingButton
                onClick={handleCodeField}
                endIcon={<SendIcon />}
                loading={loading}
                loadingPosition="end"
                variant="contained"
              >
                <span>Send</span>
              </LoadingButton>
            </>
            :
            <>
              <MuiTelInput value={phone} onChange={handlePhoneChange} label="Fill your phone number here" />
              <br />
              <br />
              <LoadingButton
                onClick={handlePhoneField}
                endIcon={<SendIcon />}
                loading={loading}
                loadingPosition="end"
                variant="contained"
              >
                <span>Login</span>
              </LoadingButton>
            </>
        }
      </div>
    </div>
  )
}