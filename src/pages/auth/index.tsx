import { UserButton } from "@clerk/nextjs";
import type { NextPage } from "next";

interface AuthProps {
  children?: React.ReactNode;
}

const Auth: NextPage<AuthProps> = () => {
  return <UserButton />;
};

export default Auth;
