import "./App.css";
import React from "react";
import { ChatBox } from "./component/ChatBox";

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 130,
        textAlign: "center",
      }}
    >
      <h1
        style={{
          paddingTop: 50,
          paddingBottom: 30,
          position: "fixed",
          top: 0,
          margin: 0,
          background: "white",
          width: "100%",
        }}
      >
        Welcome to Insight Reader
      </h1>
      <ChatBox />
    </div>
  );
}
export default App;
