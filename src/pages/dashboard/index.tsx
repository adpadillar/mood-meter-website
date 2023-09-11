import { UserButton } from "@clerk/nextjs";

import type { GetServerSideProps, NextPage } from "next";
import Fileviewer from "~/components/Fileviewer";

import verifyUser from "~/server/auth/verifyUser";

interface DashboardProps {
  children?: React.ReactNode;
}

const Dashboard: NextPage<DashboardProps> = () => {
  return (
    <>
      <div className="max-w-5xl p-4">
        <UserButton />

        <h1>Scary uploader</h1>
        <Fileviewer endpoint="scaryUploader" />

        <h1>Happy uploader</h1>
        <Fileviewer endpoint="happyUploader" />

        <h1>Sad uploader</h1>
        <Fileviewer endpoint="sadUploader" />

        <h1>Calm uploader</h1>
        <Fileviewer endpoint="calmUploader" />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<DashboardProps> = async (
  ctx
) => {
  const { req } = ctx;

  const allowedUser = await verifyUser(req);

  if (allowedUser) {
    return {
      props: {},
    };
  }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};

export default Dashboard;
