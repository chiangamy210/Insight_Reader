import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { GoogleGenerativeAI } from "@google/generative-ai";

let conversationHistory = [];
let context = "";

export async function chat(req) {
  const geminiAiApiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(geminiAiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const userInput = req;
  let fullPrompt = "";

  try {
    let context = conversationHistory
      .map((msg) => `${msg.sender}:${msg.text}`)
      .join("\n");

    fullPrompt = `${context}\nUser:${userInput}`;
    const result = await model.generateContent(fullPrompt);

    const aiResponse = result.response.candidates[0].content.parts[0].text;

    conversationHistory.push({ sender: "User", text: userInput });
    conversationHistory.push({ sender: "AI", text: aiResponse });

    //TODO fiqureout prompt context conversationHistory...

    console.log("fullPrompt", fullPrompt);

    return aiResponse;
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

//TODO connect 5001 sever.js
// const chat = async (filePath = "", query) => {

// const loader = new PDFLoader(filePath);
// const data = await loader.load();

// const textSplitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 500,
//   chunkOverlap: 0,
// });
// const splitDocs = await textSplitter.splitDocuments(data);

// const embedings = new OpenAIEmbeddings({
//   openAIApiKey: process.env.GEMINI_API_KEY,
// });
// };

// const vectorStore = await MemeryVectorStore.fromDocuments(splitDocs, embedings);

// const model = new ChatOpenAI({
//   modelName: "gpt-3.5-turbo",
//   openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
// });

// const templete = `Use the following pieces of context to answer the question at the end.
// If you don't know the answer, just say that you don't know, don't try to make up an answer.
// Use three sentences maximum and keep the answer as concise as possible.

// {context}
// Question: {question}
// Helpful Answer:`;

// const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
//   prompt: PromptTemplate.fromTemplate(template),
//   // returnSourceDocuments: true,
// });

// const response = await chain.call({
//   query,
// });

// return response;

export default chat;
