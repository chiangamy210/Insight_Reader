import React, { useState } from "react";
import InputFileUpload from "./Upload";
import { DisplayFiles } from "./DisplayFiles";

import { InputBox } from "./InputBox";
import { ChatBox } from "./ChatBox";
import { Box } from "@mui/material";

export function HomePage() {
  const [files, setFiles] = useState([]); // Use state to store files
  const [loading, setLoading] = useState(false);

  function handleUpload(event) {
    setFiles(event.target.files);
    console.log(event);
    setLoading(true); // Correctly set loading state
  }
  return (
    <div>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ marginTop: 100 }}>Welcome to Insight Reader</h1>
        <InputFileUpload handleUpload={handleUpload} />
        <DisplayFiles fileList={files} />
        <div style={{ marginTop: 30 }}></div>
        <div>
          <ChatBox />
        </div>
      </Box>
    </div>
  );
}
