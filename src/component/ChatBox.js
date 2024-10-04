import { useState } from "react";
import { InputBox } from "./InputBox";
import axios from "axios";
import { Box, Paper, styled, Typography } from "@mui/material";
import { green } from "@mui/material/colors";

//TODO modify ui
export function ChatBox() {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);

  const DOAMIN = "http://localhost:5001";

  function handleChange(e) {
    const value = e.target.value;
    setInputValue(value);
  }

  async function handleSend() {
    try {
      const question = inputValue;
      if (inputValue !== "") {
        const newMessage = {
          id: Date.now(),
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
      const botMessage = {
        id: Date.now(),
        text: response.data,
        isUser: false,
      };
      setMessages((prevMessage) => [...prevMessage, botMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const MessageBubble = styled(Box)(({ isUser }) => ({
    maxWidth: "70%",
    color: green,
    alignSelf: isUser ? "flex-end" : "flex-start",
  }));

  return (
    <Paper
      sx={{
        p: "2px 4px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 700,
        minHeight: 300,
      }}
    >
      {messages.map((message) => (
        <Box key={message.id}>
          <MessageBubble>
            <Typography variant="body1">{message.text}</Typography>
          </MessageBubble>
        </Box>
      ))}

      <Box
        sx={{
          width: "100%",
          marginTop: "auto",
          padding: "5px",
        }}
      >
        <InputBox
          handleChange={handleChange}
          handleSend={handleSend}
          loading={loading}
          inputValue={inputValue}
        />
      </Box>
    </Paper>
  );
}
