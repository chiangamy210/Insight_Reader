import { filledInputClasses } from "@mui/material";
import { useState } from "react";

export function DisplayFiles({ fileList }) {
  function display(fileList) {
    if (fileList) {
      // console.log(fileList);
      return (
        <ul>
          {Array.from(fileList).map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      );
    }
  }
  return <div>{display(fileList)}</div>;
}
