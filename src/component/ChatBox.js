import { useEffect, useRef, useState } from "react";
import { InputBox } from "./InputBox";
import axios from "axios";
import { Box, styled } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";

export function ChatBox() {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const messageEl = useRef("");

  const DOAMIN = "http://localhost:5001";

  useEffect(() => {
    if (messageEl.current) {
      messageEl.current.scrollTop = messageEl.current.scrollHeight;
    }
  }, [messages]);

  function handleChange(e) {
    const value = e.target.value;
    setInputValue(value);
  }

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
      }

      const response = await axios.get(`${DOAMIN}/chat`, {
        params: { question },
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const MessageBubble = styled(Box, {
    shouldForwardProp: (prop) => prop !== "isUser",
  })(({ isUser }) => ({
    padding: "0px 15px",
    margin: 5,
    borderRadius: 25,
    maxWidth: isUser ? "70%" : "100%",
    display: "flex",
    alignSelf: isUser ? "flex-end" : "flex-start",
    background: isUser ? "#FAB10C" : "#D6D6D6",
    color: isUser ? "white" : "black",
    letterSpacing: 2,
    fontFamily: "Microsoft Yahei",
  }));

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        minHeight: 300,
        maxHeight: 700,
        maxWidth: 690,
      }}
    >
      <Box
        ref={messageEl}
        sx={{
          p: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",

          overflowY: "auto",
        }}
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} isUser={message.isUser}>
            <div>
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          </MessageBubble>
        ))}

        <Box
          sx={{
            width: "100%",
            bottom: 20,
            display: "flex",
            justifyContent: "center",
            position: "fixed",
            background: "white",
          }}
        >
          <InputBox
            handleChange={handleChange}
            handleSend={handleSend}
            loading={loading}
            inputValue={inputValue}
          />
        </Box>
      </Box>
    </div>
  );
}
