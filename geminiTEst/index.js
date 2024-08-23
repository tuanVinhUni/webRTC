const { GoogleGenerativeAI } = require("@google/generative-ai");
const { imageBase64 } = require("./data.js");
const fs = require("fs");
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI('AIzaSyCvFebaAsqljgyNHN3mdADpNSUPRfWFddE');

// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path, mimeType) {
    const data = Buffer.from(fs.readFileSync(path)).toString("base64")
    return {
        inlineData: {
            data,
            mimeType
        },
    };
}

function base64Format(base64) {
    return base64.startsWith("data:image/png;base64,") ? base64.replace(/^data:image\/png;base64,/, '') : base64;
}

async function run() {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = "Xác định nội dung chữ trong ảnh và trả về từng nội dung của dòng theo mảng (chỉ trả về mảng)";
    const imageParts = [
        fileToGenerativePart("download (9).png", "image/png"),
        // {inlineData:{
        //     data: base64Format(imageBase64),
        //     mimeType: "image/png",
        // }}
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    
    const response = await result.response;
    const text = response.text();
    console.log(text);
}
const a = async () => {
    setInterval(function () { run(); }, 2000);
}

run();