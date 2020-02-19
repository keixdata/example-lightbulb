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

}

/**AGGREGATOR CHE MI RESTITUISCE QUANTE LAMPADINE E IL LORO STATO */

export async function howManyLightsAndStates() {
    //  resetNumberOfLigths();

    //     async function handle(msg: LightBulbEvents) {
    //         if  (msg.type === 'LIGHTBULB_INSTALLED') {
    //              incrementNumberOfLights();

    //              console.log("Now nubmer of lights are " + readNumberOfLights())
    //         }
    //         return Promise.resolve();
    //     }
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

    // subscribe({ streamName: "lightbulb" }, handle)

}



export async function howManyLightsInstalled() {
    let myArr: any = []
    async function handle(msg: LightBulbEvents) {
        const { type } = msg;
        switch (type) {
            case "LIGHTBULB_INSTALLED": {
                myArr.push(msg.id)
                // console.log("myarr:  ", myArr.length);
                // client.sadd('lightsId', msg.id);
                // console.log(myArr.length)
                client.set('lightCounter', myArr.length)
                // client.smembers('lightsId', function (err: any, reply: any) {
                //     // console.log(reply.length)
                //     if (reply.length === 0) {
                //         client.sadd('lightsId', msg.id);
                //         client.incr('lightCounter', (err: any, id: any) => {
                //             client.get('lightCounter')
                //         })
                //     } else if (myArr.length > reply.length) {
                //         console.log('mio array maggionre di rediarray')
                //         client.sadd('lightsId', msg.id);

                //         client.incr('lightCounter', (err: any, id: any) => {
                //             client.get('lightCounter')
                //         })
                //     }
                // });
                break;
            }
            default:
                return;
        }
    };

    subscribe(
        {
            streamName: "lightbulb"
        },
        handle
    );

    // client.del("lightCounter", (err: any, data: any) => { console.log("Le lampadine installate sono : ", data) })
    // client.del("lightsId", (err: any, data: any) => { console.log("Le lampadine installate sono : ", data) })

    client.get("lightCounter", (err: any, data: any) => { console.log("Le lampadine installate sono : ", data) })
}


export async function howLongOn() {

    subscribe({ streamName: "lightbulb" }, handle)

    async function handle(msg: LightBulbEvents) {
        const { type } = msg;

        switch (type) {
            case "LIGHT_TURNED_ON": {

                break;
            }


            default:
                break;
        }
    }


}