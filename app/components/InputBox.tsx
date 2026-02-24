'use client'
import Image from "next/image";
import file_icon from "@/public/file_icon.svg";
import submit_icon from "@/public/submit_icon.svg";
import warning_icon from "@/public/warning_icon.svg";
import { useRef, useState } from "react";
import { checkFile } from "../library/api";
import { Attachment, Message } from "../types/chat";

interface FileInfo {
  name: string;
  extension: string;
  size: string;
  size_raw: number;
  type: string;
  raw: File;
}

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getExtension = (filename: string): string => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "FILE";
};

// extension badge color config
const EXT_COLORS: Record<string, string> = {
  PDF: "#fee2e2",
  DOC: "#dbeafe",
  DOCX: "#dbeafe",
  TXT: "#f3f4f6",
  CSV: "#dcfce7",
  PNG: "#fef9c3",
  JPG: "#fef9c3",
  JPEG: "#fef9c3",
  WEBP: "#fef9c3",
};

const EXT_TEXT_COLORS: Record<string, string> = {
  PDF: "#b91c1c",
  DOC: "#1d4ed8",
  DOCX: "#1d4ed8",
  TXT: "#374151",
  CSV: "#15803d",
  PNG: "#92400e",
  JPG: "#92400e",
  JPEG: "#92400e",
  WEBP: "#92400e",
};

interface InputBoxProps {
  onSubmit: (message: Message) => void
}

export default function InputBox({ onSubmit }: InputBoxProps) {
  // error
  const [error, setError] = useState<Error|null>(null);

  // file
  const fileInput = useRef<HTMLInputElement>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

  const fileButtonClick = () => {
    fileInput.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileInfo({
      name: file.name,
      extension: getExtension(file.name),
      size: formatBytes(file.size),
      size_raw: file.size,
      type: file.type || "unknown",
      raw: file,
    });
  };

  const clearFile = () => {
    setFileInfo(null);
    if (fileInput.current) fileInput.current.value = "";
  };

  const ext = fileInfo?.extension ?? "";
  const badgeBg = EXT_COLORS[ext] ?? "#f3f4f6";
  const badgeText = EXT_TEXT_COLORS[ext] ?? "#374151";

  // form submit function
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const form = e.currentTarget;
    const textarea = form.elements.namedItem("message") as HTMLTextAreaElement;
    const content = textarea.value.trim();
    // reset error
    setError(null);

    if (fileInfo) {
      // check file type + size
      setError(checkFile(fileInfo.raw));
      if (error) {
        return
      }
    }

    // send new message to ChatField
    const message_id = crypto.randomUUID();
    const created_at = Date.now();
    // create attachment
    const attachment: Attachment|null = fileInfo ? {
      id: crypto.randomUUID(),
      message_id: message_id,
      file_name: fileInfo.name,
      file_size: fileInfo.size_raw,
      mime_type: fileInfo.type,
      storage_url: URL.createObjectURL(fileInfo.raw),
      created_at: created_at,
    } : null;
    const message: Message = {
      id: message_id,
      conversation_id: "random_conversation_ID",
      role: "user",
      content: content,
      created_at: created_at,
      attachments: attachment ? [attachment] : undefined
    };
    onSubmit(message);

    // reset form
    textarea.value = '';
    // textarea.style.height = 'auto';
    setFileInfo(null);
    if (fileInput.current) fileInput.current.value = '';

    // TODO: make post request to chatmdr
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 w-full h-1/4 flex flex-col justify-center items-center px-4 pb-4"
    >
      { error &&
        (<div className="container flex flex-row gap-1.5 w-full max-w-2xl p-2 bg-red-200 border-2 border-red-400">
          <Image src={warning_icon}
            width={25} height={25}
            alt=""/>
          <span>{ error.message }</span>
        </div>) }
      <div className="w-full max-w-2xl flex flex-col gap-2">
        {/* ── Input row ──────────────────────────────────────────────────── */}
        <div className="container flex flex-row gap-0.5 m-0 items-end bg-amber-50"
          onFocusCapture={(e) =>
            ((e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 0 0 2px #d97706, 0 2px 8px rgba(0,0,0,0.08)")
          }
          onBlurCapture={(e) =>
            ((e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 2px 8px rgba(0,0,0,0.06)")
          }
        >
          <textarea
            name="message"
            required
            rows={1}
            className="flex-1 min-h-10 max-h-30 p-0 text-[14px]/[1.4] color-(--Raiana-Darkest) bg-transparent outline-none resize-none overflow-y-auto"
            placeholder="Paste your text here or upload your pdf file."
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = "auto";
              t.style.height = Math.min(t.scrollHeight, 160) + "px";
            }}
          />

          <ul className="flex flex-row gap-1 m-0 p-0 items-center list-none">
            {/* Attach button */}
            <li>
              <button
                type="button"
                onClick={fileButtonClick}
                title="Attach file"
                className="p-1.5 justify-center items-center rounded-lg"
                style={{
                  background: fileInfo ? "#fef3c7" : "transparent",
                  border: fileInfo ? "1px solid #fcd34d" : "1px solid transparent",
                  transition: "background 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!fileInfo) e.currentTarget.style.background = "#fef9c3";
                }}
                onMouseLeave={(e) => {
                  if (!fileInfo) e.currentTarget.style.background = "transparent";
                }}
              >
                <input
                  type="file"
                  name="file"
                  ref={fileInput}
                  accept=".pdf,.doc,.docx,.txt,.csv,.png,.jpg,.jpeg,.webp"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <Image src={file_icon} width={20} height={20} alt="Attach file" />
              </button>
            </li>

            {/* Submit button */}
            <li>
              <button
                type="submit"
                title="Send"
                className="p-1.5 justify-center items-center bg-[#d97706] border-none rounded-lg"
                style={{ transition: "opacity 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <Image src={submit_icon} width={25} height={25} alt="Send" />
              </button>
            </li>
          </ul>
        </div>
        {/* ── File preview card ─────────────────────────────────────────── */}
        {fileInfo && (
          <div className="container flex flex-row gap-0.5 w-fit max-w-50 m-0 p-1.5 justify-start align-center bg-amber-50 rounded-md">
            {/* Extension badge */}
            <span
              style={{
                background: badgeBg,
                color: badgeText,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                borderRadius: "6px",
                padding: "4px 8px",
                flexShrink: 0,
              }}
            >
              {ext || "FILE"}
            </span>

            {/* File details */}
            <div className="flex flex-col gap-0 m-1 overflow-hidden">
              <p className="m-0 p-0.5 whitespace-nowrap font-semibold text-xs text-ellipsis overflow-hidden">
                {fileInfo.name}
              </p>
              <p className="m-0 p-0.5 whitespace-nowrap font-light text-xs text-ellipsis overflow-hidden">
                {fileInfo.size}
              </p>
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={clearFile}
              aria-label="Remove attachment"
              className="color-[#a8a29e] bg-transparent text-[18px] cursor-pointer"
              style={{
                lineHeight: 1,
                transition: "color 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#57534e")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#a8a29e")}
            >
              ×
            </button>
          </div>
        )}
      </div>
    </form>
  );
};