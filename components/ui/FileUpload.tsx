"use client";
import { useState, useRef } from "react";

interface FileUploadProps {
  label: string;
  accept?: string;
  hint?: string;
  onFile: (file: File) => void;
  color?: "blue" | "violet";
}

export function FileUpload({ label, accept = ".pdf", hint, onFile, color = "blue" }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const borderColor = color === "blue" ? "border-blue-300 hover:border-blue-500" : "border-violet-300 hover:border-violet-500";
  const bgColor = color === "blue" ? "bg-blue-50" : "bg-violet-50";
  const textColor = color === "blue" ? "text-blue-600" : "text-violet-600";

  function handleFile(file: File) {
    setFileName(file.name);
    onFile(file);
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${borderColor} ${dragging ? bgColor : "bg-white"}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      {fileName ? (
        <div className="flex items-center justify-center gap-2">
          <span className="text-green-500 text-xl">✓</span>
          <span className="text-sm font-medium text-gray-700">{fileName}</span>
          <button
            className="text-xs text-gray-400 hover:text-gray-600 ml-2"
            onClick={(e) => { e.stopPropagation(); setFileName(null); }}
          >
            Remove
          </button>
        </div>
      ) : (
        <>
          <div className={`text-3xl mb-2`}>📎</div>
          <p className={`font-semibold text-sm ${textColor}`}>{label}</p>
          <p className="text-xs text-gray-400 mt-1">{hint || "Drag & drop or click to browse · PDF"}</p>
        </>
      )}
    </div>
  );
}
