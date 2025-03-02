import { fetchModels, postModel } from "../../api";
import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";


interface CheckVerifyResponse {
  is_verified: boolean 
}

interface VerificationData {
  code?: string;
  phone?: string;
  phone_hash?: string;
  password?: string;
}

interface SendCodeResponse {
  message: string;
  phone_hash: string
}

interface VerifyResponse {
  message: string
}

export default function SettingsPage () {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [state, setState] = useState<'start' | 'middle' | 'end'>('start');
  const [verificationData, setVerificationData] = useState<VerificationData>();

  useEffect(() => {
    fetchModels('telethon/check-verified')
    .then((data: CheckVerifyResponse) => {
      setIsVerified(data.is_verified);
    })
    .catch((error) => console.error(error))
  }, [])

  const handleSendCode = () => {
    if (verificationData?.phone) {
      const payload = {
        phone: verificationData.phone
      }
      postModel('telethon/send-code', payload)
      .then((data: SendCodeResponse) => {
        setVerificationData((prev) => ({
          ...prev,
          phone_hash: data.phone_hash
        }))
        setState('middle');
      })
      .catch(error => console.error(error))
    }
  }

  const handleSubmitPass = () => {
    if (
      verificationData?.code
      && verificationData?.phone
      && verificationData?.phone_hash
      && verificationData?.password
    ) {
      postModel('telethon/verify', verificationData)
      .then((response: VerifyResponse) => {
        if (response.message == 'verified') {
          setState('end');
        }
      })
      .catch(error => console.error(error))
    }
  }



  return (
    <Box>
      <Paper square={true} elevation={3} sx={{ width: '300px', height: '400px' }}>
        {!isVerified && state == 'start' &&(
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <TextField
              required
              label='Phone number'
              onChange={(event) => {
                setVerificationData((prev) => ({
                  ...prev,
                  phone: event.target.value
                }))
              }}
              sx={{ marginBottom: '20px'}}
            />
            <Button variant='contained' onClick={handleSendCode}>Send Code</Button>
          </Box>
        )}
        {!isVerified && state == 'middle' &&(
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <TextField
              required
              label='Code'
              onChange={(event) => {
                setVerificationData((prev) => ({
                  ...prev,
                  code: event.target.value
                }))
              }}
              sx={{ marginBottom: '20px'}}
            />
            <TextField
              required
              label='Password'
              onChange={(event) => {
                setVerificationData((prev) => ({
                  ...prev,
                  password: event.target.value
                }))
              }}
              sx={{ marginBottom: '20px'}}
            />
            <Button variant='contained' onClick={handleSubmitPass}>Verify</Button>
          </Box>
        )}
        {(isVerified || state == 'end') && <Typography>Telegram is set up.</Typography>}
      </Paper>
    </Box>
  )
}

