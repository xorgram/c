import { CommandHandler, Module, updateMessage } from "$xor";
import { CustomFile } from "$grm";

const URLS: Record<string, string> = {
  "person": "https://thispersondoesnotexist.com/image",
  "cat": "https://thiscatdoesnotexist.com",
  "horse": "https://thishorsedoesnotexist.com",
  "art": "https://thisartworkdoesnotexist.com",
};

export default <Module> {
  name: "dnx",
  handlers: [
    new CommandHandler(
      "dnx",
      async ({ args, event, client }) => {
        if (args.length < 0) {
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
        const file = new CustomFile(
          "temp.jpg",
          buffer.byteLength,
          "", // @ts-expect-error - ArrayBuffer is not assignable to Buffer
          buffer,
        );
        await client.sendFile(event.chatId!, {
          file,
          forceDocument: false,
        });
      },
    ),
  ],
  help:
    "\\dnx <type> - Get an AI generated random image of a person, cat, horse, or artwork that doesn't exist in real life",
};
