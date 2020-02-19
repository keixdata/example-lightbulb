import {
  sendCommand,
  emitEvent,
  subscribe,
  runProjector,
  Message, readLastMessage
} from "@keix/message-store-client";


import { v4 } from "uuid";
import { LightbulbCommands } from './types'
import { checkIfLightIsTurnedOff ,checkIfLigthIsInstalled} from './projectors'

const id = "aecbf732-8cec-46b1-bb7c-207852ab7a3d"; // v4();
//   const id1 = "aecbf732-8cec-46b1-bb7c-207852ab7a2e"; // v4();



// sendCommand({
//   category: "lightbulb",
//   command: "INSTALL_LIGHT",
//   id,
//   data: { id}
// }).then(res => {
//   console.log(res);
// })


sendCommand({
  category: "lightbulb",
  command: "UNINSTALL_LIGHT",
  id,
  data: { id }
}).then(res => {
  console.log(res);
})

// sendCommand({
//   category: "lightbulb",
//   command: "TURN_LIGHT_ON",
//   id,
//   data: { id }
// }).then(res => {
//   console.log(res);
// });

// sendCommand({
//   category: "lightbulb",
//   command: "TURN_LIGHT_OFF",
//   id,
//   data: { id }
// }).then(res => {
//   console.log(res);
// });
async function handle(msg: LightbulbCommands) {
  const { global_position, metadata } = msg;
  // console.log('Msg', msg)

  switch (msg.type) {
    case "INSTALL_LIGHT": {
      const lastMessage = await readLastMessage({ streamName: `lightbulb-${msg.data.id}` })
      if (lastMessage == null) {
        /**non ci sono eventi sull light */
        // console.log(msg)
        return emitEvent({
          category: "lightbulb",
          event: "LIGHTBULB_INSTALLED",
          id: msg.data.id,
          metadata,
          data: msg.data
        });
      }
      break;
    }
    case "UNINSTALL_LIGHT": {
      let isInstalled = await checkIfLigthIsInstalled(msg)
      // console.log(isInstalled)
      if(!isInstalled){
        return emitEvent({
          category: "lightbulb",
          event: "LIGHT_UNINSTALLED",
          id: msg.data.id,
          metadata,
          data: msg.data
        });
      }
      break;
    };

    case "TURN_LIGHT_ON": {
      let isOff = await checkIfLightIsTurnedOff(msg)
      // console.log(isOff)
      // se true  Accendo.
      if (isOff) {
        // console.log('prima volta ON ')
        return emitEvent({
          category: "lightbulb",
          event: "LIGHT_TURNED_ON",
          id: msg.data.id,
          metadata,
          data: msg.data
        });
      }
      break;
    }
    case "TURN_LIGHT_OFF": {
      let isOff = await checkIfLightIsTurnedOff(msg);
      // console.log(isOff)
      if (!isOff) {
        // console.log('SPEGNI LA LUCE')
        // se accesa spengo.
        return emitEvent({
          category: "lightbulb",
          event: "LIGHT_TURNED_OFF",
          id: msg.data.id,
          metadata,
          data: msg.data
        });
      }
      break;
    }
  }

  return;
}

export async function run() {
  return subscribe(
    {
      streamName: "lightbulb:command"
    },
    handle
  );
}


