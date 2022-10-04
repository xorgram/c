import { CommandHandler, Module, updateMessage } from "$xor";
import { CustomFile } from "$grm";

export default <Module> {
  name: "httpcat",
  handlers: [
    new CommandHandler(
      "httpcat",
      async ({ args, event, client }) => {
        if (args.length !== 1 && /^\d{3}$/.test(args[0])) {
          updateMessage(event, "Invalid code");
          return;
        }

        const status = args[0];

        const resp = await fetch(`https://http.cat/${status}`);
        if (resp.status !== 200) {
          updateMessage(event, "Invalid code");
          return;
        }
        event.message.delete();

        const buffer = await resp.arrayBuffer();
        const file = new CustomFile(
          "temp.jpg",
          buffer.byteLength,
          "", // @ts-expect-error Argument of type 'ArrayBuffer' is not assignable to parameter of type 'Buffer'.
          buffer,
        );
        await client.sendFile(event.chatId!, {
          file,
          forceDocument: false,
        });
      },
      {
        aliases: ["cat"],
      },
    ),
  ],
  help: "\\httpcat <code> - Get an image of a Cat explaining HTTP status code",
};
