import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

// file type + size config
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv'
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const checkFile = (file: File): Error|null => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return Error("File Error: Invalid file type");
  }

  if (file.size > MAX_FILE_SIZE) {
    return Error("File Error: File size exceeds max file size");
  }

  return null;
}

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