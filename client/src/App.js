import "./App.css";
import React from "react";
import { useState } from "react";
import { InputBox } from "./component/InputBox";
import axios from "axios";
import { ChatBox } from "./component/ChatBox";
import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  let fileList = [];
  // const DOAMIN = "http://localhost:5001";
  const DOAMIN = "https://insight-reader-server.vercel.app";

  function splitLongMessage(text, chunkSize = 2500) {
    const chunks = [];
    let startIndex = 0;

    while (startIndex < text.length) {
      let endIndex = startIndex + chunkSize;

      if (endIndex < text.length) {
        const lastPunctuationIndex = text.lastIndexOf(".", endIndex);
        const lastCommaIndex = text.lastIndexOf(",", endIndex);
        const lastSplitIndex = Math.max(lastPunctuationIndex, lastCommaIndex);

        if (lastSplitIndex > startIndex) {
          endIndex = lastSplitIndex + 1;
        }
      }

      chunks.push(text.slice(startIndex, endIndex).trim());
      startIndex = endIndex;
    }

    return chunks;
  }

  function DisplayFiles({ fileList }) {
    if (fileList.length > 0 && fileList.length <= 3) {
      return (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "start",
            margin: "0 10vw",
          }}
        >
          {Array.from(fileList).map((file, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                paddingLeft: "5px",
                border: "2px solid #D6D6D6 ",
                color: "#858FCD",
                margin: 2,
                borderRadius: 10,
                maxWidth: "30vw",
                maxHeight: "5vh",
              }}
            >
              <div
                style={{
                  fontSize: "0.85em",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
                title={file}
              >
                {file}
              </div>
              <IconButton
                onClick={() => {
                  removeFile(index);
                }}
              >
                <ClearIcon style={{ color: "#D6D6D6", fontSize: "0.8em" }} />
              </IconButton>
            </div>
          ))}
        </div>
      );
    }
    return <div>you can upload up to 3 pdf files</div>;
  }

  function removeFile(fileIndex) {
    const updatedFileNames = fileNames.filter(
      (_, index) => fileIndex !== index
    );
    setFileNames(updatedFileNames);

    const updatedFiles = files.filter((_, index) => fileIndex !== index);
    setFiles(updatedFiles);
  }

  function handleChange(e) {
    const value = e.target.value;
    setInputValue(value);
  }

  async function handleUpload(event) {
    setLoading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < event.target.files.length; i++) {
        fileList.push(event.target.files[i].name);
        formData.append("files", event.target.files[i]);
      }
      setFileNames(fileList);
      const response = await axios.post(`${DOAMIN}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const filePaths = response.data;
      setFiles(filePaths);
    } catch (error) {
      console.error("file upload error: ", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    try {
      const question = inputValue;
      if (inputValue !== "") {
        const newMessage = {
          id: uuidv4(),
          text: inputValue,
          isUser: true,
        };
        setLoading(true);
        setMessages((prevMessage) => [...prevMessage, newMessage]);
        setInputValue("");
        const response = await axios.get(`${DOAMIN}/chat`, {
          params: { question, filePaths: files.join(",") },
        });
        const botMessageChunks = splitLongMessage(response.data);

        botMessageChunks.forEach((chunk) => {
          const botMessage = {
            id: uuidv4(),
            text: chunk,
            isUser: false,
          };
          setMessages((prevMessage) => [...prevMessage, botMessage]);
        });
      }
    } catch (error) {
      console.error("chat error: ", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          paddingTop: "4vh",
          paddingBottom: "2vh",
          height: "3vh",
          position: "fixed",
          top: messages.length > 0 ? "0px" : "35vh",
          margin: 0,
          background: "white",
          width: "100vw",
          fontSize: "1.5em",
        }}
      >
        Welcome to Insight Reader
      </h1>
      <ChatBox messages={messages} />
      <div
        style={{
          position: "fixed",
          bottom: messages.length > 0 ? "0px" : "40vh",
          width: "100%",
          paddingBottom: "1vh",
          background: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <DisplayFiles fileList={fileNames} />
        <InputBox
          handleChange={handleChange}
          handleSend={handleSend}
          loading={loading}
          inputValue={inputValue}
          handleUpload={handleUpload}
        />
      </div>
    </div>
  );
}
export default App;
