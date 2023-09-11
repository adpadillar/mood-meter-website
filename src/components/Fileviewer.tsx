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
  const utils = api.useContext();
  const [dragging, setDragging] = useState(false);
  const category = categorySchema.parse(endpoint.replace("Uploader", ""));
  const { data, isLoading } = api.example.getSongsByCategory.useQuery({
    category,
  });

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
          onClientUploadComplete={(f) => {
            f?.forEach((file) => {
              utils.example.getSongsByCategory.setData(
                { category: category },
                (prev) => {
                  if (prev) {
                    return {
                      songFiles: [
                        ...prev.songFiles,
                        {
                          clasification: category,
                          name: file.name,
                          url: file.url,
                          id: file.key,
                          metadata: {
                            uploadedAt: Date.now(),
                            uploadedBy: "TODO: get user id",
                          },
                        },
                      ],
                    };
                  }

                  return prev;
                }
              );
            });
            setDragging(false);
          }}
          endpoint={endpoint}
          className="rounded-md border border-dashed p-4 ut-button:mt-2 ut-button:transform ut-button:bg-orange-500 ut-button:px-4 ut-button:transition-all hover:ut-button:scale-105 ut-button:active:scale-95 ut-upload-icon:opacity-50 ut-readying:opacity-50 ut-uploading:ut-button:animate-spin ut-uploading:ut-button:cursor-not-allowed ut-uploading:ut-button:opacity-70"
        />
      ) : (
        <div>
          {isLoading ? (
            "Loading..."
          ) : (
            <div className="flex flex-col space-y-2 rounded-md border border-dashed bg-gray-50 p-4">
              {data?.songFiles.map((song, idx) => {
                return (
                  <a href={song.url} key={idx}>
                    {song.name.replace(".mp3", "")}
                  </a>
                );
              })}
              {data?.songFiles.length === 0 && (
                <p className="opacity-60">
                  No hay canciones. Arrastra una canción para subirla
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Fileviewer;
