import { UserButton, clerkClient } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import type { GetServerSideProps, NextPage } from "next";
import { UploadButton } from "~/components/Uploadthing";

interface DashboardProps {
  children?: React.ReactNode;
}

const Dashboard: NextPage<DashboardProps> = () => {
  return (
    <>
      <UserButton />

      <UploadButton endpoint="audioUploader" />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<DashboardProps> = async (
  ctx
) => {
  const { req } = ctx;
  const { userId } = getAuth(req);

  const user = userId ? await clerkClient.users.getUser(userId) : null;

  const allowedEmails: Record<string, true> = {
    "adpadillar25@gmail.com": true,
  };

  if (user) {
    if (user.emailAddresses) {
      for (const email of user.emailAddresses) {
        if (allowedEmails[email.emailAddress]) {
          return {
            props: {},
          };
        }
      }
    }
  }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};

export default Dashboard;
