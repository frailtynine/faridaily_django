import { Button } from "@mui/material";
import { useComponent } from "../Main/Context";
import Login from "../Main/Login";

export default function LogoutButton() {
  const {setCurrentComponent} = useComponent();
  return (
    <Button
      variant="contained"
      onClick={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setCurrentComponent(<Login />)
      }}
    >
      Logout
    </Button>
  )
}