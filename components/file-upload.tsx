import { FileIcon, Folder, Loader, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { v4 } from "uuid";
import { useDropzone } from "react-dropzone";
import { createClient } from "@/utils/supabase/client";
import Loading from "./Loading";

type Props = {
  apiEndpoint: "agencyLogo" | "avatar" | "subaccountLogo";
  onChange: (url?: string) => void;
  value?: string;
};

const FileUpload = ({ apiEndpoint, onChange, value }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const client = createClient();

  useEffect(() => {
    const convertURLtoFile = async (url: string) => {
      try {
        const response = await fetch(url);
        const data = await response.blob();
        const filename = url.split("/").pop() || "downloaded";
        const metadata = { type: data.type };
        const file = new File([data], filename, metadata);
        setFile(file);
        setFilePath(url); // Speichere die URL als filePath
      } catch (error) {
        console.error("Error converting URL to File:", error);
      }
    };

    if (value) {
      convertURLtoFile(value);
    } else {
      setFilePath(null); // Setze filePath zurück, wenn kein value vorhanden ist
    }
  }, [value]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFile(file);
    setFilePath(URL.createObjectURL(file)); // Erstelle einen lokalen Pfad für die Vorschau
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const handleButtonClick = async (e: any) => {
    if (isUploading) return;

    if (file) {
      e.stopPropagation();
      console.log("upload file");
      setIsUploading(true);
      console.log(isUploading);
      await uploadFile();
      setIsUploading(false);
      console.log(isUploading);
    } else {
      console.log("select file");
      fileInputRef.current?.click();
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    // Erstelle eine eindeutige Dateiname für das Hochladen
    const fileName = `${apiEndpoint}/${v4()}.${file.type.split("/").pop()}`;

    try {
      // Lade die Datei zum Supabase Bucket hoch
      const { data, error } = await client.storage
        .from("agencies") // Ersetze "agencies" durch den Namen deines Buckets
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true, // true ermöglicht es, existierende Dateien zu überschreiben
        });

      if (error) {
        throw error;
      }

      // Wenn der Upload erfolgreich war, generiere eine URL zur Datei
      const {
        data: { publicUrl },
      } = client.storage.from("agencies").getPublicUrl(data.path);

      if (!publicUrl) {
        alert("No URL Data found");
      }

      console.log("Datei erfolgreich hochgeladen: ", publicUrl);

      setFilePath(publicUrl);
      onChange(publicUrl);
    } catch (error: any) {
      console.error("Fehler beim Hochladen der Datei: ", error.message);
      alert("Fehler beim Hochladen der Datei: " + error.message);
    }
  };

  const removeFile = (e: any) => {
    e.stopPropagation();
    setFile(null);
    setFilePath(null);
    onChange(""); // Informiere den übergeordneten Zustand, dass keine Datei ausgewählt ist
  };

  const renderFilePreview = () => {
    if (!file) return null;

    const type = file.type.split("/").pop();
    if (type !== "pdf") {
      return (
        <div className="relative w-40 h-40">
          <Image
            src={filePath || ""}
            alt="uploaded image"
            className="object-contain"
            fill
          />
        </div>
      );
    } else {
      return (
        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
          <FileIcon />
          <a
            href={filePath || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
          >
            View PDF
          </a>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        {...getRootProps()}
        className="w-full flex flex-col items-center p-10 bg-muted/30 border-2 border-dashed border-gray-300 cursor-pointer"
      >
        <input {...getInputProps()} />

        {file && (
          <>
            {renderFilePreview()}
            <Button onClick={removeFile} variant="ghost" type="button">
              <X className="h-4 w-4" />
              Remove Logo
            </Button>
          </>
        )}

        <Button onClick={handleButtonClick} type="button" className="mt-4">
          {isUploading ? (
            <Loading />
          ) : file ? (
            <p className="flex justify-center items-center">
              <UploadCloud className="h-4 w-4 mr-2 " />
              Upload Logo
            </p>
          ) : (
            <p className="flex justify-center items-center">
              <Folder className="h-4 w-4 mr-2 " />
              Select File
            </p>
          )}
        </Button>
        <div className="text-muted-foreground pt-5 text-sm">
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag &apos;n drop some files here, or click to select files</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
