// version of using gemini without embedding to answer question

// import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PromptTemplate } from "langchain/prompts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";

let conversationHistory = [];

export async function chat(req, filePaths = "") {
  const geminiAiApiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(geminiAiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const userInput = req;
  let fullPrompt = "";
  try {
    let data = "";
    if (filePaths.length > 0) {
      for (const url of filePaths) {
        // Fetch the PDF content directly from the URL
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch PDF from ${url}: ${response.statusText}`
          );
        }

        // Read the response as an array buffer
        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: "application/pdf" });

        // Use WebPDFLoader to parse the PDF
        const loader = new WebPDFLoader(blob);
        const pdfDocuments = await loader.load();

        // Concatenate the content of all pages
        data += pdfDocuments.map((doc) => doc.pageContent).join("\n");
      }
      const template = `
      You are a helpful assistant. When the user asks questions related to a specific article , use the content from the article to answer. If the question is unrelated to the article, answer based on what you already know.
      
      1. Recognizing Article Questions:
         If the user mentions 'article', 'document', "file", "story" or high fregency workds, specific proffesional words in the article, assume it refers to the article content. Provide a concise, accurate and organized with bullet button response based on the article. If the article does not contain the answer, respond with: "The document does not mention that." and provide the knowledge based on what you know , but you have to tell the user this information is not in the article.
      
      2. General Queries:
         If the question does not mention an article or file, treat it as a general question and answer with what you know, you don't have to relate to the article.
      
      3. Language Matching:
         Reply the same language the user use. If the question is in Chinese, answer in Chinese. If the question is in English, answer in English.
      
      
      Article Content: {data}
      Question: {question}
      Helpful Answer:
      `;

      const promptTemplate = new PromptTemplate({
        template,
        inputVariables: ["data", "question"],
      });

      const content = await promptTemplate.format({
        data: data,
        question: userInput,
      });

      const result = await model.generateContent(content);
      const aiResponse = result.response.candidates[0].content.parts[0].text;

      return aiResponse;
    }

    let context = conversationHistory
      .map((msg) => `${msg.sender}:${msg.text}`)
      .join("\n");

    fullPrompt = `${context}\nUser:${userInput}`;
    const result = await model.generateContent(fullPrompt);
    const aiResponse = result.response.candidates[0].content.parts[0].text;

    conversationHistory.push({ sender: "User", text: userInput });
    conversationHistory.push({ sender: "AI", text: aiResponse });

    return aiResponse;
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

export default chat;
