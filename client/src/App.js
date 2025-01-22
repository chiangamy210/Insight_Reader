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
  const [filesPath, setFilesPath] = useState([]);
  const [localFileList, setlocalFileList] = useState([]);

  let templocalFileList = [];
  const DOAMIN = "https://insight-reader.vercel.app";
  // const DOAMIN = "http://localhost:5001";

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

  async function handleUpload(event) {
    setLoading(true);
    const formData = new FormData();
    for (let i = 0; i < event.target.files.length; i++) {
      templocalFileList.push(event.target.files[i]);
      setlocalFileList(templocalFileList);
      if (event.target.files[i].type === "application/pdf") {
        formData.append("files", event.target.files[i]);
      }
    }
    try {
      const response = await axios.post(`${DOAMIN}/upload`, formData, {
        headers: { "Content-Type": "application/pdf" },
      });
      setFilesPath(response.data.filePaths);
    } catch (error) {
      console.error("file upload error: ", error);
    } finally {
      setLoading(false);
    }
  }

  function DisplayFiles({ localFileList }) {
    if (
      localFileList &&
      localFileList.length > 0 &&
      localFileList.length <= 3
    ) {
      if (isPDF(localFileList)) {
        return (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "start",
              margin: "0 10vw",
            }}
          >
            {localFileList.map((file, index) => (
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
                  title={file.name}
                >
                  {file.name}
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
      } else {
        return <div style={{ color: "red" }}>please upload pdf files only</div>;
      }
    } else if (localFileList.length === 0) {
      return <div>you can upload up to 3 files</div>;
    }
  }

  function isPDF(localFileList) {
    return localFileList.every((file) => {
      return file.type === "application/pdf";
    });
  }

  function removeFile(fileIndex) {
    const updatedLocalFileList = localFileList.filter(
      (_, index) => fileIndex !== index
    );
    setlocalFileList(updatedLocalFileList);
    const updatedFilesPath = localFileList.filter(
      (_, index) => fileIndex !== index
    );
    setFilesPath(updatedFilesPath);
  }

  function handleChange(e) {
    const value = e.target.value;
    setInputValue(value);
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
          params: { question, filePaths: filesPath.join(",") },
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
        <DisplayFiles localFileList={localFileList} />
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
//change font
