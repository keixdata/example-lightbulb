import {
    sendCommand,
    emitEvent,
    subscribe,
    runProjector,
    Message, readLastMessage
} from "@keix/message-store-client";
import { LightBulbEvents } from './types'
const redis = require("redis");
const client = redis.createClient();


client.on("error", function (error: String) {
    console.error(error);
});
client.on('connect', function () {
    console.log('connected');
});

// import Ligths, { findLigthByIdAndUpdate, resetNumberOfLigths, incrementNumberOfLights, readNumberOfLights } from './models/lights'


/**=========================================
 *  AGGREGATOR QUANTE LAMPADINE INSTALLATE 
 ===========================================* */
export async function howManyLightsInstalled() {
    let myArr: any = []
    async function handle(msg: LightBulbEvents) {
        const { type } = msg;
        // console.log(msg)

        switch (type) {
            case "LIGHTBULB_INSTALLED": {
                myArr.push(msg.id);
                client.get("lightCounter", (err: any, data: any) => {
                    if (myArr.length > data) {
                        return client.incr('lightCounter', (err: any, id: any) => {
                            client.get("lightCounter", (err: any, data: any) => { data > 0 ? console.log("Le lampadine installate sono : ", data) : console.log('non ci son lampadine installate') })
                        })
                    } else {
                        client.get("lightCounter", (err: any, data: any) => { data > 0 ? console.log("Le lampadine installate sono : ", data) : console.log('non ci son lampadine installate') })
                    };
                });
                break;
            };
            case "LIGHT_UNINSTALLED": {
                if (msg.position !== 0) {
                    return client.decr('lightCounter', (err: any, id: any) => {
                        client.get("lightCounter", (err: any, data: any) => { data > 0 ? console.log("Le lampadine installate sono : ", data) : console.log('non ci son lampadine installate') })
                    });
                } else {
                    break
                };
            };

            default: {
                return console.log('non ci sono luci installate')
            }
        }
    };
    subscribe(
        {
            streamName: "lightbulb"
        },
        handle
    );
}




/**===========================================================
 * AGGREAGATOR CHE AGGIONRA LO STATE DELLE LIGHTS INSTALLATE 
 * crea un hash chiamato lightStats su redis con coppie chiavi valore,  
 * le chiavi saranno gli id delle luci, i valori il numero di ore per cui le luci sono accese
 * ===========================================================*/
export async function howLongOn() {


    async function handle(msg: LightBulbEvents) {
        console.log(msg.time)
        const { type } = msg
        switch (type) {
            case "LIGHT_TURNED_ON": {
                // client.hmset('lightStats', msg.data.id, msg.time);
                // console.log(msg.time)
                break;
            }
            case "LIGHT_TURNED_OFF": {
                // client.hmset('lightStats', msg.data.id, msg.time);
                break;
            }
            default:
                return
        }
    }
    // client.hgetall('lightStats', function (err: any, object: any) {
    //     console.log(object);
    // });
    subscribe(
        {
            streamName: "lightbulb"
        },
        handle
    );

};

// export async function howLongOn() {

//     subscribe({ streamName: "lightbulb" }, handle)

//     async function handle(msg: LightBulbEvents) {
//         const { type } = msg;

//         switch (type) {
//             case "LIGHT_TURNED_ON": {

//                 break;
//             }


//             default:
//                 break;
//         }
//     }
// }
