import { Box, InputBase, styled } from "@mui/material";
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
    <Box component="form" style={{ position: "relative" }}>
      <Button
        component="label"
        role={undefined}
        variant="text"
        color="#858FCD"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        style={{ color: "#858FCD" }}
      >
        <VisuallyHiddenInput type="file" onChange={handleUpload} multiple />
      </Button>
      <InputBase
        style={{ marginLeft: "auto", width: "80%" }}
        placeholder="Ask me anything, or upload a file and ask me questions about them"
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
    </Box>
  );
}
//TODO fix inputBoox position
