import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import verifyUser from "./auth/verifyUser";
import { getFirestore } from "firebase-admin/firestore";
import { serverApp } from "./firebase";
import { type NextApiRequest } from "next";
import { type FileDoc } from "./api/routers/schemas";

const f = createUploadthing();

// Whats the opposite of Pick in ts?

const uploadFileMetadata = async (f: Omit<FileDoc, "id">) => {
  const db = getFirestore(serverApp);

  const docRef = db.collection("files").doc();

  return docRef.set({ ...f, id: docRef.id });
};

const authMiddleware = async ({ req }: { req: NextApiRequest }) => {
  const allowedUser = await verifyUser(req);

  if (!allowedUser) {
    throw new Error("You are not allowed to upload");
  }

  return { uploadedBy: allowedUser.id, uploadedAt: Date.now() };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  calmUploader: f({ audio: { maxFileSize: "16MB", maxFileCount: 50 } })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      await uploadFileMetadata({
        clasification: "calm",
        random: Math.random() * 100000,
        metadata,
        name: file.name,
        url: file.url,
        expCount: 0,
      });
      console.log("upload complete");
    }),
  happyUploader: f({ audio: { maxFileSize: "16MB", maxFileCount: 50 } })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      await uploadFileMetadata({
        clasification: "happy",
        random: Math.random() * 100000,
        metadata,
        name: file.name,
        url: file.url,
        expCount: 0,
      });
    }),
  sadUploader: f({ audio: { maxFileSize: "16MB", maxFileCount: 50 } })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      await uploadFileMetadata({
        clasification: "sad",
        random: Math.random() * 100000,
        metadata,
        name: file.name,
        url: file.url,
        expCount: 0,
      });
    }),
  scaryUploader: f({ audio: { maxFileSize: "16MB", maxFileCount: 50 } })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      await uploadFileMetadata({
        clasification: "scary",
        random: Math.random() * 100000,
        metadata,
        name: file.name,
        url: file.url,
        expCount: 0,
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
export type OurFileRouterKey = keyof OurFileRouter;
