import { Button } from "@mui/material";
import { deleteModel } from "../../api";
import { useComponent } from "../Main/Context";
import MainPage from "../Main/MainPage";

interface DeleteButtonProps {
  id: number;
  endpoint: string;
}

export default function DeleteButton ({id, endpoint}: DeleteButtonProps) {
  const{ setCurrentComponent }= useComponent();

  const handleDelete = async () => {
    deleteModel(endpoint, id)
    .then(() => (setCurrentComponent(<MainPage />)))
    .catch((error) => {
      console.error(error)
    })
  }

  return (
    <Button
      variant="contained"
      onClick={() => handleDelete()}
      size="small"
    >Delete</Button>
  )
}