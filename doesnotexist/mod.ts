import { CommandHandler, Module, updateMessage } from "$xor";
import { CustomFile } from "$grm";

const URLS: Record<string, string> = {
  "person": "https://thispersondoesnotexist.com/image",
  "cat": "https://thiscatdoesnotexist.com",
  "horse": "https://thishorsedoesnotexist.com",
  "art": "https://thisartworkdoesnotexist.com",
};

const doesNotExist: Module = {
  name: "doesnotexist",
  handlers: [
    new CommandHandler(
      "doesnotexist",
      async ({ args, event, client }) => {
        if (args.length > 0) {
          await updateMessage(
            event,
            "Select one of the following: \n" + Object.keys(URLS).join(", "),
          );
          return;
        }

        const type = args[0];
        const url = URLS[type];

        if (!url) {
          await updateMessage(event, "Invalid type");
          return;
        }

        event.message.delete();
        const buffer = await (await fetch(url)).arrayBuffer();
        const file = new CustomFile("temp.jpg", buffer.byteLength, "", buffer);
        await client.sendFile(event.chatId!, {
          file,
          forceDocument: false,
        });
      },
    ),
  ],
};

export default doesNotExist;
