import { useEffect, useState } from "react";
import { verifyToken } from "../../api";
import GridPage from "../DataGrid/GridPage";
import { useComponent } from "./Context";
import { Box, CircularProgress, Container, AppBar, Toolbar, Typography, Button } from "@mui/material";
import FloatButton from "../Buttons/FloatButton";
import LogoutButton from "../Buttons/LogoutButton";
import SettingsPage from "../Settings/SettingsPage";
import Login from "./Login";

export default function MainPage () {
  const {currentComponent, setCurrentComponent} = useComponent();
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    verifyToken()
    .then(() => {
      setCurrentComponent(<GridPage />);
      setLoading(false);
    })
    .catch(() => {
      setCurrentComponent(<Login />)
      setLoading(false);
    })
  }, [])

  if (loading) {
    return <CircularProgress />
  }
  
  return (
    <Box>
      <Box>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              onClick={() => setCurrentComponent(<GridPage />)}
              sx={{ cursor: 'pointer' }}
            >
              Faridaily Control Centre
            </Typography>
            <Box sx={{ ml: 'auto', gap: '10px'}}>
              <Button
                variant="contained"
                onClick={() => setCurrentComponent(<SettingsPage />)}
                sx={{marginRight: '10px'}}
              >
                Settings
              </Button>
              <LogoutButton />
            </Box>
        </Toolbar>
      </AppBar>
      </Box>
      {currentComponent}
      <FloatButton />
    </Box>
  )
}