import {
    sendCommand,
    emitEvent,
    subscribe,
    runProjector,
    Message, readLastMessage
} from "@keix/message-store-client";
import { LightbulbCommands } from './types'

export async function checkIfLightIsTurnedOn(msg: LightbulbCommands) {
    const reducer = (prev: boolean, next: Message<string>) => {

        const { type } = next;

        switch (type) {
            case "LIGHT_TURNED_ON":
                console.log('era gia accessa', prev);
                return false
            case "LIGHT_TURNED_OFF":
                console.log('era gia accessa e lo spenta', prev);
                return true

            default:
                return prev;
        }
    };
    /**ESEGUO IL PROIETTORE SUGLI EVENTI LIGHBULB */
    const isTurnedOff = await runProjector(
        {
            streamName: `lightbulb-${msg.data.id}`
        },
        reducer,
        false
    );
    return isTurnedOff;
}


// export async function checkIfLightIsTurnedOff(msg: LightbulbCommands) {
//     const reducer = (prev: boolean, next: Message<string>) => {
//         // console.log("Next:  ", next.type)
//         const { type } = next;
//         switch (type) {
//             case "LIGHT_TURNED_ON": {
//                 // console.log("SE ACCESA:  ", next)
//                 return true
//             }
//             case "LIGHT_TURNED_OFF": {
//                 // console.log("SE SPENTA : ", next)
//                 return false
//             }
//             default:
//                 return prev;
//         }
//     };
//     /**ESEGUO IL PROIETTORE SUGLI EVENTI LIGHBULB */
//     const isTurnedOn = await runProjector(
//         {
//             streamName: `lightbulb-${msg.data.id}`
//         },
//         reducer,
//         true
//     );

//     return isTurnedOn;

// }

