import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export const extractFileContent = async (file: File): Promise<string> => {
  let parseResult;
  let extractedText = "";
  const buffer = Buffer.from(await file.arrayBuffer());
  
  if (file.type === "application/pdf") {
    parseResult = await new PDFParse(buffer);
    extractedText = (await parseResult.getText()).text;
  } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    parseResult = await mammoth.extractRawText({ buffer });
    extractedText = parseResult.value;
  } else {
    // unsupported file type
    extractedText = "unsupported";
  }

  return extractedText;
}