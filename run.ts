import {
    sendCommand,
    emitEvent,
    subscribe,
    runProjector,
    Message, readLastMessage
  } from "@keix/message-store-client";
  import { database } from './config/db'
  
  import { v4 } from "uuid";
  import { LightbulbCommands } from './types'
  import { checkIfLightIsTurnedOn } from './projectors'
//   import mongoose from "mongoose";
//   import { updateStateOnMongo ,howManyLightsAndStates} from './aggregators'
  const id = "aecbf732-8cec-46b1-bb7c-207852ab7a1d"; // v4();
//   const id1 = "aecbf732-8cec-46b1-bb7c-207852ab7a2e"; // v4();
  
  
  
//   mongoose.set("useCreateIndex", true);
//   mongoose.set("useFindAndModify", false);
//   mongoose.set("debug", false);
//   mongoose.connect(`${database}`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });
  
//   // On Connection
//   mongoose.connection.on("connected", () => {
//     console.log(`Connected to database:  ${database}`);
//   });
  
//   // On Error
//   mongoose.connection.on("error", err => {
//     console.log("Database error: " + err);
//   });
  
  
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
    command: "TURN_LIGHT_ON",
    id,
    data: { id }
  }).then(res => {
    console.log(res);
  });
  
  // sendCommand({
  //   category: "lightbulb",
  //   command: "TURN_LIGHT_OFF",
  //   id,
  //   data: { id }
  // }).then(res => {
  //   console.log(res);
  // });
  async function handle(msg: LightbulbCommands) {
    // console.log(msg.type)
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
            data: msg.data
          });
        }
        break;
      }
      case "TURN_LIGHT_ON": {
        let isOn = await checkIfLightIsTurnedOn(msg)
        console.log("TURN_LIGHT_ON:  ",isOn)
        // se true  Accendo.
        if (isOn ) {
          console.log('prima volta ON')
          return emitEvent({
            category: "lightbulb",
            event: "LIGHT_TURNED_ON",
            id: msg.data.id,
            data: msg.data
          });
        }
        break;
      }
      case "TURN_LIGHT_OFF": {
        let isOn = await checkIfLightIsTurnedOn(msg);
        console.log("TURN_LIGHT_OFF:  ",isOn)
        if (!isOn) {
          console.log('SPEGNI LA LUCE')
          // se accesa spengo.
          return emitEvent({
            category: "lightbulb",
            event: "LIGHT_TURNED_OFF",
            id: msg.data.id,
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
  

  