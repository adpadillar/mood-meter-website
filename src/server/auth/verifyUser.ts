import { clerkClient } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { type IncomingMessage } from "http";

const verifyUser = async (
  req: IncomingMessage & {
    cookies: Partial<Record<string, string>>;
  }
) => {
  const { userId } = getAuth(req);
  const user = userId ? await clerkClient.users.getUser(userId) : null;

  const allowedEmails: Record<string, true> = {
    "adpadillar25@gmail.com": true,
    "nicole.arana.sasj@gmail.com": true,
  };

  if (user) {
    if (user.emailAddresses) {
      for (const email of user.emailAddresses) {
        if (allowedEmails[email.emailAddress]) {
          return user;
        }
      }
    }
  }

  return null;
};

export default verifyUser;
