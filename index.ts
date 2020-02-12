import {
  sendCommand,
  emitEvent,
  subscribe,
  runProjector,
  Message
} from "@keix/message-store-client";
import { v4 } from "uuid";

const id = "aecbf732-8cec-46b1-bb7c-207852ab7a1d"; // v4();

/*
sendCommand({
  category: "lightbulb",
  command: "TURN_LIGHT_ON",
  id,
  data: { id }
}).then(res => {
  console.log(res);
});*/

/*
emitEvent({
  category: "lightbulb",
  event: "LIGHT_TURNED_ON",
  id,
  data: { id }
}).then(res => {
  console.log(res);
});
*/
type LightbulbData = { id: string };
type LightbulbCommands =
  | Message<"TURN_LIGHT_ON", LightbulbData>
  | Message<"INSTALL_LIGHT", LightbulbData>;

async function handle(msg: LightbulbCommands) {
  console.log(msg);
  switch (msg.type) {
    case "TURN_LIGHT_ON":
      const reducer = (prev: boolean, next: Message<string>) => {
        if (next.type === "LIGHT_TURNED_ON") {
          return false;
        } else if (next.type === "LIGHT_TURNED_OFF") {
          return true;
        } else {
          return prev;
        }
      };
      const isTurnedOff = await runProjector(
        {
          streamName: `lightbulb-${msg.data.id}`
        },
        reducer,
        true
      );
      console.log("Light is " + (isTurnedOff ? "turned off" : "turned on"));

      if (isTurnedOff) {
        // Accendo.
        return emitEvent({
          category: "lightbulb",
          event: "LIGHT_TURNED_ON",
          id: msg.data.id,
          data: msg.data
        });
      }
  }

  return;
}

subscribe(
  {
    streamName: "lightbulb:command"
  },
  handle
);
