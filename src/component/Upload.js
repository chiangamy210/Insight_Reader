import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function InputFileUpload({ handleUpload }) {
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      style={{ margin: 30, background: "#858FCD" }}
    >
      Upload files
      <VisuallyHiddenInput
        type="file"
        // onChange={(event) => console.log(event.target.files)}
        onChange={handleUpload}
        multiple
      />
    </Button>
  );
}
