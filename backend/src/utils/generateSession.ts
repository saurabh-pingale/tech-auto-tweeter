/** 
To generate the session for Telegram run this script. 
It will automatically stores the session in `.telegram_session` in root. 

To run below command in Terminal: 
  `npx ts-node src/utils/generateSession.ts`
*/

import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import input from "input";
import fs from "fs";
import { env } from "../config/env";

(async () => {
  console.log("Starting Telegram session generation...");

  const client = new TelegramClient(
    new StringSession(""), 
    Number(env.TELEGRAM_API_ID), 
    env.TELEGRAM_API_HASH!, 
    { connectionRetries: 5 }
  );

  await client.start({
    phoneNumber: async () => await input.text("Please enter your phone number: "),
    password: async () => await input.text("Please enter your password (2FA if enabled): "),
    phoneCode: async () => await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });

  const sessionString = (client.session as StringSession).save();
  fs.writeFileSync(".telegram_session", sessionString, "utf8");

  console.log("Session string:", sessionString);
  console.log("Login successful! Session saved to .telegram_session");
})();