"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_store_client_1 = require("@keix/message-store-client");
const projectors_1 = require("./projectors");
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
// sendCommand({
//   category: "lightbulb",
//   command: "TURN_LIGHT_ON",
//   id,
//   data: { id }
// }).then(res => {
//   console.log(res);
// });
message_store_client_1.sendCommand({
    category: "lightbulb",
    command: "TURN_LIGHT_OFF",
    id,
    data: { id }
}).then(res => {
    console.log(res);
});
function handle(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log(msg.type)
        switch (msg.type) {
            case "INSTALL_LIGHT": {
                const lastMessage = yield message_store_client_1.readLastMessage({ streamName: `lightbulb-${msg.data.id}` });
                if (lastMessage == null) {
                    /**non ci sono eventi sull light */
                    // console.log(msg)
                    return message_store_client_1.emitEvent({
                        category: "lightbulb",
                        event: "LIGHTBULB_INSTALLED",
                        id: msg.data.id,
                        data: msg.data
                    });
                }
                break;
            }
            case "TURN_LIGHT_ON": {
                let isOn = yield projectors_1.checkIfLightIsTurnedOn(msg);
                console.log("TURN_LIGHT_ON:  ", isOn);
                // se true  Accendo.
                if (isOn) {
                    console.log('prima volta ON');
                    return message_store_client_1.emitEvent({
                        category: "lightbulb",
                        event: "LIGHT_TURNED_ON",
                        id: msg.data.id,
                        data: msg.data
                    });
                }
                break;
            }
            case "TURN_LIGHT_OFF": {
                let isOn = yield projectors_1.checkIfLightIsTurnedOff(msg);
                console.log("TURN_LIGHT_OFF:  ", isOn);
                if (!isOn) {
                    console.log('SPEGNI LA LUCE');
                    // se accesa spengo.
                    return message_store_client_1.emitEvent({
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
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        return message_store_client_1.subscribe({
            streamName: "lightbulb:command"
        }, handle);
    });
}
exports.run = run;
//# sourceMappingURL=run.js.map