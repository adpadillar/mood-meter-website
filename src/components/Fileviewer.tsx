import React, { useEffect, useRef, useState } from "react";
import { type OurFileRouterKey } from "~/server/uploadthing";
import { UploadDropzone } from "~/components/Uploadthing";

import { api } from "~/utils/api";
import { categorySchema } from "~/server/api/routers/schemas";

interface FileviewerProps {
  children?: React.ReactNode;
  endpoint: OurFileRouterKey;
}

const Fileviewer: React.FC<FileviewerProps> = ({ endpoint }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const category = categorySchema.parse(endpoint.replace("Uploader", ""));
  const { data } = api.example.getSongsByCategory.useQuery({ category });

  useEffect(() => {
    const curr = viewerRef.current;
    if (curr) {
      curr.addEventListener("dragenter", () => {
        setDragging(true);
      });

      curr.addEventListener("dragleave", () => {
        setDragging(false);
      });
    }

    return () => {
      if (curr) {
        curr.removeEventListener("dragenter", () => {
          setDragging(false);
        });

        curr.removeEventListener("dragleave", () => {
          setDragging(false);
        });
      }
    };
  }, []);

  return (
    <div ref={viewerRef}>
      {dragging ? (
        <UploadDropzone
          onClientUploadComplete={() => {
            setDragging(false);
          }}
          endpoint={endpoint}
          className="rounded-md border border-dashed p-4 ut-button:mt-2 ut-button:transform ut-button:bg-orange-500 ut-button:px-4 ut-button:transition-all hover:ut-button:scale-105 ut-button:active:scale-95 ut-upload-icon:opacity-50 ut-readying:opacity-50 ut-uploading:ut-button:animate-spin ut-uploading:ut-button:cursor-not-allowed ut-uploading:ut-button:opacity-70"
        />
      ) : (
        <div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Fileviewer;
