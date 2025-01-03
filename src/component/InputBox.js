import { Box, InputAdornment, OutlinedInput, styled } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as React from "react";
import Button from "@mui/material/Button";

export function InputBox({
  handleChange,
  handleSend,
  loading,
  inputValue,
  handleUpload,
}) {
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <Box component="form">
      <OutlinedInput
        id="outlined-multiline-flexible"
        multiline
        maxRows={4}
        sx={{
          width: "90vw",
          maxWidth: 1200,
          borderRadius: 35,
        }}
        placeholder="Ask me anything"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
          }
        }}
        endAdornment={
          <InputAdornment position="end">
            <LoadingButton
              style={{
                color: "#27A2BB",
              }}
              size="small"
              onClick={handleSend}
              endIcon={<SendIcon />}
              loading={loading}
              loadingPosition="end"
              variant="text"
              disabled={loading}
            ></LoadingButton>
          </InputAdornment>
        }
        startAdornment={
          <InputAdornment position="start">
            <Button
              component="label"
              role={undefined}
              variant="text"
              color="#858FCD"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              style={{ color: "#858FCD" }}
            >
              <VisuallyHiddenInput
                type="file"
                onChange={handleUpload}
                multiple
              />
            </Button>
          </InputAdornment>
        }
      />
    </Box>
  );
}
//deploy client and server
