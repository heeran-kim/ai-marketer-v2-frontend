// src/components/common/DragAndDropUploader.tsx
"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { IoClose } from "react-icons/io5";
import Image from "next/image";

interface DragAndDropUploaderProps {
  value?: string;
  onChange?: (file: File | null, previewUrl: string | null) => void;
  fileType?: "logo" | "image" | "data";
}

export default function DragAndDropUploader({
  value,
  onChange,
  fileType = "image",
}: DragAndDropUploaderProps) {
  const [preview, setPreview] = useState(value || "");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    // If a URL is from the server, add cache busting
    if (value && !value.startsWith("blob:")) {
      setPreview(`${value}?t=${new Date().getTime()}`);
    } else {
      setPreview(value || "");
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        let fileURL = null;
        if (fileType === "image" || fileType === "logo") {
          fileURL = URL.createObjectURL(file);
          setPreview(fileURL);
        }
        setUploadedFile(file);
        if (onChange) onChange(file, fileURL);
      }
    },
    [onChange, fileType]
  );

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation();
    setPreview("");
    setUploadedFile(null);
    if (onChange) onChange(null, null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      fileType === "image" || fileType === "logo"
        ? { "image/*": [] }
        : {
            "text/csv": [".csv"],
            "application/json": [".json"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
              [".xlsx"],
          },
    maxFiles: 1, // Limits selection to a single file
    multiple: false, // Sets the HTML input's multiple attribute to false
    preventDropOnDocument: true, // Prevents browser from opening files when dropped outside dropzone
    noDragEventsBubbling: true, // Prevents drag events from bubbling up to parent elements
  });

  return (
    <div
      {...getRootProps()}
      className={`relative flex items-center justify-center cursor-pointer transition group mx-auto
                ${
                  fileType === "logo"
                    ? "w-24 h-24 rounded-full aspect-square border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900"
                    : fileType === "image"
                    ? "max-w-xs aspect-[4/5] border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                    : "w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
    >
      <input {...getInputProps({ disabled: !!preview })} />

      {uploadedFile || preview ? (
        fileType === "image" || fileType === "logo" ? (
          <div
            className={`relative flex items-center justify-center cursor-pointer transition group mx-auto
                                    ${
                                      fileType === "logo"
                                        ? "w-24 h-24 rounded-full aspect-square border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900"
                                        : "max-w-xs max-w-md bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
          >
            <Image
              src={preview}
              alt="Uploaded Preview"
              width={200}
              height={200}
              className={`w-full h-full object-cover border border-gray-300
                                        ${
                                          fileType === "logo"
                                            ? "rounded-full"
                                            : "aspect-[4/5]"
                                        }`}
            />
            <button
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              <IoClose size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {uploadedFile?.name || "Uploaded File"}
            </p>
            <button
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              <IoClose size={14} />
            </button>
          </div>
        )
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-xs text-center">
          {isDragActive
            ? "Drop the file here..."
            : "Drag & Drop or Click to Upload"}
        </p>
      )}
    </div>
  );
}
