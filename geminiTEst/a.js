const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI('AIzaSyCvFebaAsqljgyNHN3mdADpNSUPRfWFddE');

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const { imageBase64 } = require("./data");


async function main() {
    const prompt = "Xác định chữ trong ảnh và trả về mảng (chỉ trả về mảng)";
    const image = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/png",
      },
    };
    
    const result = await model.generateContent([prompt, image]);
    console.log(result.response.text());
}
main()