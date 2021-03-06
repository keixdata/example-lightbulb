import {
    sendCommand,
    emitEvent,
    subscribe,
    runProjector,
    Message, readLastMessage
} from "@keix/message-store-client";
import { LightbulbCommands } from './types'


export async function checkIfLigthIsInstalled(msg: LightbulbCommands) {

    const reducer = (prev: boolean, next: Message<string>) => {
        const { type } = next;
        switch (type) {
            case "LIGHT_UNINSTALLED": {
                return true;
            }
            default:
                return prev;
        }
    };

    /**ESEGUO IL PROIETTORE SUGLI EVENTI LIGHBULB */
    const isInstalled = await runProjector(
        {
            streamName: `lightbulb-${msg.data.id}`
        },
        reducer,
        false
    );
    return isInstalled

}



export async function checkIfLightIsTurnedOff(msg: LightbulbCommands) {
    const reducer = (prev: boolean, next: Message<string>) => {
        const { type } = next;
        switch (type) {

            case "LIGHT_TURNED_OFF": {
                return true
            }
            case "LIGHT_TURNED_ON": {
                return false;

            }
            default:
                return prev;
        }
    };
    /**ESEGUO IL PROIETTORE SUGLI EVENTI LIGHBULB */
    const isTurnedOn = await runProjector(
        {
            streamName: `lightbulb-${msg.data.id}`
        },
        reducer,
        true
    );

    return isTurnedOn;

}

