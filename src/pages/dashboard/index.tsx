import { UserButton } from "@clerk/nextjs";

import type { GetServerSideProps, NextPage } from "next";
import Fileviewer from "~/components/Fileviewer";

import verifyUser from "~/server/auth/verifyUser";

interface DashboardProps {
  children?: React.ReactNode;
}

const Dashboard: NextPage<DashboardProps> = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="max-w-5xl p-4">
        <div className="flex items-center justify-between py-4">
          <h1 className="font-bold">Neurosense Art</h1>
          <UserButton />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div className="flex flex-col space-y-3">
            <h1 className="text-3xl font-bold">Canciones Miedo</h1>
            <Fileviewer endpoint="scaryUploader" />
          </div>
          <div className="flex flex-col space-y-3">
            <h1 className="text-3xl font-bold">Canciones Felices</h1>
            <Fileviewer endpoint="happyUploader" />
          </div>

          <div className="flex flex-col space-y-3">
            <h1 className="text-3xl font-bold">Canciones Tristes</h1>
            <Fileviewer endpoint="sadUploader" />
          </div>

          <div className="flex flex-col space-y-3">
            <h1 className="text-3xl font-bold">Canciones Calma</h1>
            <Fileviewer endpoint="calmUploader" />
          </div>
        </div>
      </div>
    </div>
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
