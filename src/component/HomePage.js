import React, { useState } from "react";
import InputFileUpload from "./Upload";
import { DisplayFiles } from "./DisplayFiles";

import { InputBox } from "./InputBox";
import { ChatContent } from "./ChatContent";

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
      <box
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
          <ChatContent />
        </div>
        <div
          style={{
            display: "flex",
            position: "fixed",
            bottom: 0,
            justifyContent: "center",
            marginBottom: 25,
          }}
        >
          <InputBox />
        </div>
      </box>
    </div>
  );
}
