import { eveChannel } from "eve/channels/eve";
import { localDev, none, vercelOidc } from "eve/channels/auth";

export default eveChannel({
  auth: [
    // Allow authenticated Vercel callers.
    vercelOidc(),

    // Support local development.
    localDev(),

    // Allow anonymous visitors to use this public demo.
    none(),
  ],
});
