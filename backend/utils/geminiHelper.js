/* eslint @typescript-eslint/no-var-requires: "off" */
const { GoogleGenerativeAI } = require('@google/generative-ai');

// import { GoogleGenerativeAI } from "@google/generative-ai";
// const fs = require("fs");

// Converts local file information to a GoogleGenerativeAI.Part object.
// function fileToGenerativePart(path, mimeType) {
//     const data = Buffer.from(fs.readFileSync(path)).toString("base64")
//     return {
//         inlineData: {
//             data,
//             mimeType
//         },
//     };
// }

function base64Format(base64) {
  return base64.startsWith('data:image/png;base64,')
    ? base64.replace(/^data:image\/png;base64,/, '')
    : base64;
}

async function determineTextInImage(image, apiKey, prompt) {
  const genAI = new GoogleGenerativeAI(apiKey);

  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const imageParts = [
    {
      inlineData: {
        data: base64Format(image),
        mimeType: 'image/png',
      },
    },
  ];

  const result = await model.generateContent([prompt, ...imageParts]);

  const response = await result.response;
  const text = response.text();
  return text;
}
module.exports = { determineTextInImage };
