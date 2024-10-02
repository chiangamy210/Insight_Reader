import { useState } from "react";
import { InputBox } from "./InputBox";
import axios from "axios";

export function ChatContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const DOAMIN = "http://localhost:5001";
  function handleChange(e) {
    const value = e.target.value;
    setInputValue(value);
  }
  //TODO fix param and backend running
  async function handleSend() {
    setIsLoading(true);
    const question = inputValue;

    try {
      const response = await axios.get(`${DOAMIN}/chat`, {
        params: { question },
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        width: 600,
        height: 600,
      }}
    >
      <div> content here</div>

      <div
        style={{
          display: "flex",
          position: "fixed",
          bottom: 0,
          justifyContent: "center",
          marginBottom: 25,
        }}
      >
        <InputBox handleChange={handleChange} handleSend={handleSend} />
      </div>
    </div>
  );
}
