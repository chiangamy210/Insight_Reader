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
      }}
    >
      <h1 style={{ marginTop: 100 }}>Welcome to Insight Reader</h1>
      <ChatBox />
    </div>
  );
}
export default App;
