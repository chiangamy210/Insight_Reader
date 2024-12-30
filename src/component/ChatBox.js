import { useEffect, useRef, useState } from "react";
// import { InputBox } from "./InputBox";
// import axios from "axios";
import { Box, IconButton, styled } from "@mui/material";
import ReactMarkdown from "react-markdown";
// import { v4 as uuidv4 } from "uuid";

export function ChatBox({ messages }) {
  // const [loading, setLoading] = useState(false);
  // const [inputValue, setInputValue] = useState("");
  // const [messages, setMessages] = useState([]);
  const lastMessageRef = useRef(null);
  // const [files, setFiles] = useState([]);
  // const [fileNames, setFileNames] = useState([]);
  // let fileList = [];
  // const DOAMIN = "http://localhost:5001";

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // function handleChange(e) {
  //   const value = e.target.value;
  //   setInputValue(value);
  // }

  // function splitLongMessage(text, chunkSize = 2500) {
  //   const chunks = [];
  //   let startIndex = 0;

  //   while (startIndex < text.length) {
  //     let endIndex = startIndex + chunkSize;

  //     if (endIndex < text.length) {
  //       const lastPunctuationIndex = text.lastIndexOf(".", endIndex);
  //       const lastCommaIndex = text.lastIndexOf(",", endIndex);
  //       const lastSplitIndex = Math.max(lastPunctuationIndex, lastCommaIndex);

  //       if (lastSplitIndex > startIndex) {
  //         endIndex = lastSplitIndex + 1;
  //       }
  //     }

  //     chunks.push(text.slice(startIndex, endIndex).trim());
  //     startIndex = endIndex;
  //   }

  //   return chunks;
  // }

  const MessageBubble = styled(Box, {
    shouldForwardProp: (prop) => prop !== "isUser",
  })(({ isUser }) => ({
    padding: "0 1em",
    margin: "1em 1em",
    borderRadius: 25,
    maxWidth: isUser ? "70vw" : "90vw",
    display: "flex",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    alignSelf: isUser ? "flex-end" : "flex-start",
    background: isUser ? "#FAB10C" : "#D6D6D6",
    color: isUser ? "white" : "black",
    letterSpacing: 2,
    fontFamily: "Microsoft Yahei",
    textAlign: "left",
  }));

  // async function handleUpload(event) {
  //   setLoading(true);
  //   try {
  //     const formData = new FormData();
  //     for (let i = 0; i < event.target.files.length; i++) {
  //       fileList.push(event.target.files[i].name);
  //       formData.append("files", event.target.files[i]);
  //     }
  //     setFileNames(fileList);
  //     const response = await axios.post(`${DOAMIN}/upload`, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     const filePaths = response.data;
  //     setFiles(filePaths);
  //   } catch (error) {
  //     console.error("file upload error: ", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // async function handleSend() {
  //   try {
  //     const question = inputValue;
  //     if (inputValue !== "") {
  //       const newMessage = {
  //         id: uuidv4(),
  //         text: inputValue,
  //         isUser: true,
  //       };
  //       setLoading(true);
  //       setMessages((prevMessage) => [...prevMessage, newMessage]);
  //       setInputValue("");

  //       const response = await axios.get(`${DOAMIN}/chat`, {
  //         params: { question, filePaths: files.join(",") },
  //       });
  //       const botMessageChunks = splitLongMessage(response.data);

  //       botMessageChunks.forEach((chunk) => {
  //         const botMessage = {
  //           id: uuidv4(),
  //           text: chunk,
  //           isUser: false,
  //         };
  //         setMessages((prevMessage) => [...prevMessage, botMessage]);
  //       });
  //     }
  //   } catch (error) {
  //     console.error("chat error: ", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // function DisplayFiles({ fileList }) {
  //   if (fileList.length > 0) {
  //     return (
  //       <div style={{ display: "flex", alignItems: "flex-start" }}>
  //         {Array.from(fileList).map((file, index) => (
  //           <div
  //             key={index}
  //             style={{
  //               display: "flex",
  //               justifyContent: "space-between",
  //               alignItems: "center",
  //               border: "2px solid #D6D6D6 ",
  //               color: "#858FCD",
  //               margin: 2,
  //               borderRadius: 10,
  //             }}
  //           >
  //             <IconButton
  //               onClick={() => {
  //                 removeFile(index);
  //               }}
  //             >
  //               <div
  //                 style={{
  //                   paddingLeft: 10,
  //                   fontSize: 14,
  //                   overflow: "hidden",
  //                   maxWidth: 200,
  //                   maxHeight: 30,
  //                 }}
  //               >
  //                 {file}
  //               </div>
  //               <ClearIcon style={{ color: "#D6D6D6" }} />
  //             </IconButton>
  //           </div>
  //         ))}
  //       </div>
  //     );
  //   }
  //   return null;
  // }

  // function removeFile(fileIndex) {
  //   const updatedFileNames = fileNames.filter(
  //     (_, index) => fileIndex !== index
  //   );
  //   setFileNames(updatedFileNames);

  //   const updatedFiles = files.filter((_, index) => fileIndex !== index);
  //   setFiles(updatedFiles);
  // }

  return (
    <div>
      <Box
        style={{
          maxWidth: 1200,
          marginTop: "9vh",
          marginBottom: "17vh",
          width: "100vw",
          height: "75%",
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          justifyContent: "center",
          overflowY: "auto",
          flexGrow: 1,
        }}
      >
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            isUser={message.isUser}
            ref={index === messages.length - 1 ? lastMessageRef : null}
          >
            <div>
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          </MessageBubble>
        ))}
      </Box>
      {/* <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          height: "20%",
          background: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
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
      </div> */}
    </div>
  );
}
//TODO text overflow contain
