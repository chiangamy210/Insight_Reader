import { Box, InputBase, Paper, styled, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";

export function InputBox({ handleChange, handleSend, loading, inputValue }) {
  return (
    <Box
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        justifyContent: "center",
        width: 690,
      }}
    >
      <TextField
        sx={{ ml: 1, flex: 1 }}
        placeholder="Upload your PDF files and you can ask any question about the files"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <LoadingButton
        style={{ backgroundColor: "#27A2BB" }}
        size="small"
        onClick={handleSend}
        endIcon={<SendIcon />}
        loading={loading}
        loadingPosition="end"
        variant="contained"
        disabled={loading}
      >
        Send
      </LoadingButton>
    </Box>
  );
}
