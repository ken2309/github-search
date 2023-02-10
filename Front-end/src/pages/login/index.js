import { useState } from 'react'
import { MuiTelInput } from 'mui-tel-input';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
export default function Index() {
  const [phone, setPhone] = useState();
  const [loading, setLoading] = useState(false);

  const handleChange = (newPhone) => {
    setPhone(newPhone)
  }
  const handleClick = () => {
    setLoading(true)
    setTimeout(()=>setLoading(false),2000)
  }

  return (
    <>
      <MuiTelInput value={phone} onChange={handleChange} label="Fill your phone number here" />
      <br/>
      <br/>
      <LoadingButton
          onClick={handleClick}
          endIcon={<SendIcon />}
          loading={loading}
          loadingPosition="end"
          variant="contained"
        >
          <span>Login</span>
        </LoadingButton>
    </>
  )
}