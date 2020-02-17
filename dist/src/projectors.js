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
function checkIfLightIsTurnedOn(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        const reducer = (prev, next) => {
            const { type } = next;
            switch (type) {
                case "LIGHT_TURNED_ON":
                    return false;
                default:
                    return prev;
            }
        };
        /**ESEGUO IL PROIETTORE SUGLI EVENTI LIGHBULB */
        const isTurnedOff = yield message_store_client_1.runProjector({
            streamName: `lightbulb-${msg.data.id}`
        }, reducer, true);
        return isTurnedOff;
    });
}
exports.checkIfLightIsTurnedOn = checkIfLightIsTurnedOn;
function checkIfLightIsTurnedOff(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        const reducer = (prev, next) => {
            const { type } = next;
            switch (type) {
                case "LIGHT_TURNED_OFF": {
                    return true;
                }
                default:
                    return true;
            }
        };
        /**ESEGUO IL PROIETTORE SUGLI EVENTI LIGHBULB */
        const isTurnedOn = yield message_store_client_1.runProjector({
            streamName: `lightbulb-${msg.data.id}`
        }, reducer, false);
        return isTurnedOn;
    });
}
exports.checkIfLightIsTurnedOff = checkIfLightIsTurnedOff;
//# sourceMappingURL=projectors.js.map