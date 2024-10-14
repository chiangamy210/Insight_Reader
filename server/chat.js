// import { PDFLoader } from "langchain/document_loaders/fs/pdf";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// // import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { PromptTemplate } from "langchain/prompts";
// import { RetrievalQAChain } from "langchain/chains";
// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// let conversationHistory = [];

// export async function chat(req, filePath = "") {
//   const geminiAiApiKey = process.env.GEMINI_API_KEY;

//   const genAI = new GoogleGenerativeAI(geminiAiApiKey);
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//   const embeddingModel = new GoogleGenerativeAIEmbeddings({
//     apiKey: geminiAiApiKey,
//   });

//   const userInput = req;
//   let fullPrompt = "";

//   try {
//     if (filePath.length > 0) {
//       let data;

//       // Load and process each PDF file
//       for (const path of filePath) {
//         const loader = new PDFLoader(path); // Pass the file path directly to the loader
//         data = await loader.load(); // Load PDF content
//       }

//       const textSplitter = new RecursiveCharacterTextSplitter({
//         chunkSize: 500,
//         chunkOverlap: 0,
//       });

//       const spiltDocs = await textSplitter.splitDocuments(data);

//       const vectorStore = await MemoryVectorStore.fromDocuments(
//         spiltDocs,
//         embeddingModel
//       );

//       const template = `Use the following pieces of context to answer the question at the end.
//         If you don't know the answer, just say that this file doesn't mention it, don't try to make up an answer.
//         Use three sentences maximum and keep the answer as concise as possible.

//         {context}
//         Question: {question}
//         Helpful Answer:`;

//       const promptTemplate = PromptTemplate.fromTemplate(template);
//       const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
//         prompt: promptTemplate,
//       });
//       console.log(5, filePath, "userInput", userInput, "chain", chain);

//       const response = await chain.call({ query: userInput });
//       console.log("respnse", response);
//       return response;
//     }

//     let context = conversationHistory
//       .map((msg) => `${msg.sender}:${msg.text}`)
//       .join("\n");

//     fullPrompt = `${context}\nUser:${userInput}`;
//     const result = await model.generateContent(fullPrompt);

//     const aiResponse = result.response.candidates[0].content.parts[0].text;

//     conversationHistory.push({ sender: "User", text: userInput });
//     conversationHistory.push({ sender: "AI", text: aiResponse });

//     return aiResponse;
//   } catch (error) {
//     console.error("Error generating content:", error);
//   }
// }

// export default chat;

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { PromptTemplate } from "langchain/prompts";
import { RetrievalQAChain } from "langchain/chains";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BaseLLM } from "langchain/llms/base"; // Import BaseLLM for custom LLM class
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

class CustomGoogleGeminiLLM extends BaseLLM {
  constructor(apiKey) {
    // Pass an empty configuration object to BaseLLM to prevent the cache error
    super({ cache: false });
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async _call(prompt) {
    const result = await this.model.generateContent(prompt);
    return result.response.candidates[0].content.parts[0].text;
  }
  async _generate(prompts) {
    const responses = await Promise.all(
      prompts.map(async (prompt) => {
        const result = await this.model.generateContent(prompt);
        return result.response.candidates[0].content.parts[0].text;
      })
    );

    // Return an object that follows the structure of LLMResult expected by Langchain
    return {
      generations: responses.map((response) => [{ text: response }]),
    };
  }

  _llmType() {
    return "google-gemini";
  }
}

let conversationHistory = [];

export async function chat(req, filePath = "") {
  const geminiAiApiKey = process.env.GEMINI_API_KEY;
  const customLLM = new CustomGoogleGeminiLLM(geminiAiApiKey);
  const embeddingModel = new GoogleGenerativeAIEmbeddings({
    apiKey: geminiAiApiKey,
  });
  const userInput = req;
  let fullPrompt = "";

  try {
    if (filePath.length > 0) {
      let data;
      let vectorStore;
      // Load and process each PDF file
      for (const path of filePath) {
        const loader = new PDFLoader(path);
        data = await loader.load();

        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 500,
          chunkOverlap: 0,
        });

        const spiltDocs = await textSplitter.splitDocuments(data);
        console.log("splitDocx", spiltDocs);
        vectorStore = await MemoryVectorStore.fromDocuments(
          spiltDocs,
          embeddingModel
        );
      }

      // const textSplitter = new RecursiveCharacterTextSplitter({
      //   chunkSize: 500,
      //   chunkOverlap: 0,
      // });

      // const spiltDocs = await textSplitter.splitDocuments(data);
      // console.log("splitDocx", spiltDocs);
      // const vectorStore = await MemoryVectorStore.fromDocuments(
      //   spiltDocs,
      //   embeddingModel
      // );

      const template = `
      You are a helpful assistant. When the user asks questions related to a specific article , use the content from the article to answer. If the question is unrelated to the article, answer based on general knowledge.
      
      1. Recognizing Article Questions:
         If the user mentions 'article', 'document', or words in the article, assume it refers to the article content. Provide a concise and accurate response based on the article. If the article does not contain the answer, respond with: "The document does not mention that."
      
      2. General Queries:
         If the question does not mention an article or file, treat it as a general question and answer with what you know, you don't have to relate to the article.
      
      3. Language Matching:
         Respond in the same language the user uses to ask the question. If the user asks in Chinese, respond in Chinese. If the user asks in English, respond in English.
      
      {context}
      Question: {question}
      Helpful Answer:
      `;

      const promptTemplate = PromptTemplate.fromTemplate(template);
      const chain = RetrievalQAChain.fromLLM(
        customLLM,
        vectorStore.asRetriever(),
        {
          prompt: promptTemplate,
        }
      );

      const response = await chain.call({ query: userInput });
      return response.text;
    }

    let context = conversationHistory
      .map((msg) => `${msg.sender}:${msg.text}`)
      .join("\n");

    fullPrompt = `${context}\nUser:${userInput}`;
    const result = await customLLM._call(fullPrompt);

    const aiResponse = result;

    conversationHistory.push({ sender: "User", text: userInput });
    conversationHistory.push({ sender: "AI", text: aiResponse });

    return aiResponse;
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

export default chat;
// TODO figure out how to make the Ai 's answer by fixing prompt
