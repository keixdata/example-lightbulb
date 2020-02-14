import {
    sendCommand,
    emitEvent,
    subscribe,
    runProjector,
    Message, readLastMessage
} from "@keix/message-store-client";
import { LightBulbEvents } from './types'
import Ligths, { findLigthByIdAndUpdate, resetNumberOfLigths, incrementNumberOfLights, readNumberOfLights } from './models/lights'

/**AGGREAGATOR CHE AGGIONRA LO STATE DELLE LIGHTS INSTALLATE */
export async function updateStateOnMongo() {
    async function handle(msg: LightBulbEvents) {

        const { type } = msg
        switch (type) {
            case "LIGHTBULB_INSTALLED":
                let lights = new Ligths({ id: msg.data.id, state: false });
                await lights.save();
                break;
            case "LIGHT_TURNED_ON":
                // console.log("Id", msg)
                await findLigthByIdAndUpdate(msg.data.id, { state: true });
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

export async function howManyLightsAndStates() {
 resetNumberOfLigths();

    async function handle(msg: LightBulbEvents) {
        if  (msg.type === 'LIGHTBULB_INSTALLED') {
             incrementNumberOfLights();

             console.log("Now nubmer of lights are " + readNumberOfLights())
        }
        return Promise.resolve();
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

    subscribe({ streamName: "lightbulb" }, handle)

}



