import {
  Divider,
  IconButton,
  InputBase,
  Paper,
  TextField,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/Send";

import { pink } from "@mui/material/colors";

export function InputBox() {
  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 600,
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Upload your PDF files and you can ask any question about the files"
        inputProps={{ "aria-label": "search google maps" }}
      />
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SendRoundedIcon color="success" />
      </IconButton>
    </Paper>
  );
}
