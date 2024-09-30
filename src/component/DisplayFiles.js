import { filledInputClasses } from "@mui/material";
import { useState } from "react";
export function DisplayFiles({ fileList }) {
  function display(fileList) {
    if (fileList.length === 0) {
      return <>no file uploaded</>;
    } else {
      return (
        <ul>
          <div>Uploaded file(s):</div>
          {Array.from(fileList).map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      );
    }
  }
  return <div>{display(fileList)}</div>;
}
