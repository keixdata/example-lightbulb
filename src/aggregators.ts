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

/**AGGREAGATOR CHE AGGIONRA LO STATE DELLE LIGHTS INSTALLATE */
export async function saveOnRedis() {
    async function handle(msg: LightBulbEvents) {

        const { type } = msg
        switch (type) {
            case "LIGHTBULB_INSTALLED":
                client.sadd(['light', "id", msg.id, "type", msg.type, msg.time], (err: any, reply: any) => {
                    console.log(reply); // 3
                });

                client.exists('light', function (err: any, reply: any) {
                    if (reply === 1) {
                        client.smembers('light', function (err: any, reply: any) {
                            console.log(reply);
                        });
                        console.log('exists');
                    } else {
                        console.log('doesn\'t exist');
                    }
                })
                // let lights = new Ligths({ id: msg.data.id, state: false });
                // await lights.save();
                break;
            case "LIGHT_TURNED_ON":
                // console.log("Id", msg)
                // await findLigthByIdAndUpdate(msg.data.id, { state: true });
                break;
            case "LIGHT_TURNED_OFF":
                // console.log("Id", el)
                // await findLigthByIdAndUpdate(msg.data.id, { state: false });
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

};
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

            default:{
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
