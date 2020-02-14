import {
    sendCommand,
    emitEvent,
    subscribe,
    runProjector,
    Message, readLastMessage
} from "@keix/message-store-client";
import { LightBulbEvents } from './types'
import Ligths, { findLigthByIdAndUpdate } from './models/lights'

/**AGGREAGATOR CHE AGGIONRA LO STATE DELLE LIGHTS INSTALLATE */
export async function updateStateOnMongo() {
    async function handle(msg: LightBulbEvents) {

        const { type } = msg
        switch (type) {
            case "LIGHTBULB_INSTALLED":
                let lights = new Ligths({ id: msg.data.id, state: false });
                lights.save();
                break;
            case "LIGHT_TURNED_ON":
                // console.log("Id", msg)
              await  findLigthByIdAndUpdate(msg.data.id, { state: true });
                break;
            case "LIGHT_TURNED_OFF":
                // console.log("Id", el)
                await findLigthByIdAndUpdate(msg.data.id, { state: false });
                break;
            default:
                return
        }

    }
    subscribe(
        {
            streamName: "lightbulb"
        },
        handle
    );

}

/**AGGREGATOR CHE MI RESTITUISCE QUANTE LAMPADINE E IL LORO STATO */



