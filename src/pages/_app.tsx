import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { NextUIProvider } from "@nextui-org/react";
import { ClerkProvider } from "@clerk/nextjs";
import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
