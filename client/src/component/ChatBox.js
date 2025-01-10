import { useEffect, useRef } from "react";
import { Box, styled } from "@mui/material";
import ReactMarkdown from "react-markdown";

export function ChatBox({ messages }) {
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const customRenderers = {
    code({ children, ...props }) {
      return (
        <Box
          component="pre"
          sx={{
            padding: "1em",
            borderRadius: "4px",
            whiteSpace: "pre-wrap",
          }}
          {...props}
        >
          {children}
        </Box>
      );
    },
  };

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
              <ReactMarkdown components={customRenderers}>
                {message.text}
              </ReactMarkdown>
            </div>
          </MessageBubble>
        ))}
      </Box>
    </div>
  );
}
