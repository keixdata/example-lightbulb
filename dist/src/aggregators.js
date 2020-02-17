"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const message_store_client_1 = require("@keix/message-store-client");
const lights_1 = __importDefault(require("./models/lights"));
/**AGGREAGATOR CHE AGGIONRA LO STATE DELLE LIGHTS INSTALLATE */
function updateStateOnMongo() {
    return __awaiter(this, void 0, void 0, function* () {
        function handle(msg) {
            return __awaiter(this, void 0, void 0, function* () {
                const { type } = msg;
                switch (type) {
                    case "LIGHTBULB_INSTALLED":
                        let lights = new lights_1.default({ id: msg.data.id, state: false });
                        yield lights.save();
                        break;
                    case "LIGHT_TURNED_ON":
                        // console.log("Id", msg)
                        yield lights_1.findLigthByIdAndUpdate(msg.data.id, { state: true });
                        break;
                    case "LIGHT_TURNED_OFF":
                        // console.log("Id", el)
                        yield lights_1.findLigthByIdAndUpdate(msg.data.id, { state: false });
                        break;
                    default:
                        return;
                }
            });
        }
        message_store_client_1.subscribe({
            streamName: "lightbulb"
        }, handle);
    });
}
exports.updateStateOnMongo = updateStateOnMongo;
/**AGGREGATOR CHE MI RESTITUISCE QUANTE LAMPADINE E IL LORO STATO */
function howManyLightsAndStates() {
    return __awaiter(this, void 0, void 0, function* () {
        lights_1.resetNumberOfLigths();
        function handle(msg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (msg.type === 'LIGHTBULB_INSTALLED') {
                    lights_1.incrementNumberOfLights();
                    console.log("Now nubmer of lights are " + lights_1.readNumberOfLights());
                }
                return Promise.resolve();
            });
        }
        /*
        async function handle(msg: LightBulbEvents) {
            let myEvent = []
            myEvent.push(msg)
            await myEvent.reduce((prev, next) => {
                let { qnt } = prev
                const { type } = next;
                switch (type) {
                    case "LIGHTBULB_INSTALLED":
    
                        console.log(next)
                        qnt++
                        return { qnt }
    
                    default:
                        return prev;
                }
    
            }, { qnt: 0 })
        }*/
        message_store_client_1.subscribe({ streamName: "lightbulb" }, handle);
    });
}
exports.howManyLightsAndStates = howManyLightsAndStates;
//# sourceMappingURL=aggregators.js.map