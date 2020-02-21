import {
    sendCommand,
    emitEvent,
    subscribe,
    runProjector,
    Message, readLastMessage
} from "@keix/message-store-client";
import { checkIfLightIsTurnedOff } from './projectors'
import { LightBulbEvents, LightbulbCommands } from './types'
import Redis from 'ioredis';
import { Client, RequestParams } from '@elastic/elasticsearch';

const elastic_Client = new Client({ node: "http://116.202.100.141:31807" });


const client = new Redis();




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
    await client.del("howManyMinutesOff")
    await client.del('howManyMinutesOn');

    async function handle(msg: LightBulbEvents) {

        const { type } = msg
        switch (type) {
            case "LIGHT_TURNED_ON": {
                const reply = await client.exists('lightStats');

                if (reply === 1) {
                    let lastDate: any = await client.hmget('lightStats', msg.data.id);
                    let dateOff: any = new Date(lastDate[0])

                    let dateOn: any = new Date(msg.time)
                    let diff = Math.abs(dateOn - dateOff);
                    let minutes = Math.floor((diff / 1000) / 60);
                    await client.hincrby("howManyMinutesOff", msg.data.id, minutes)

                    await client.hmset('lightStats', msg.data.id, msg.time.toISOString())

                } else {
                    /**non esiste su redis */
                    await client.hmset('lightStats', msg.data.id, msg.time.toISOString())

                };
                break;
            }
            case "LIGHT_TURNED_OFF": {
                // console.log(ms)
                let lastDate: any = await client.hmget('lightStats', msg.data.id)
                let dateOn: any = new Date(lastDate[0])
                let dateOf: any = new Date(msg.time)

                let diff = Math.abs(dateOn - dateOf);
                let minutes = Math.floor((diff / 1000) / 60);
                console.log(minutes)
                console.log(await client.hincrby('howManyMinutesOn', msg.data.id, minutes))

                await client.hmset('lightStats', msg.data.id, msg.time.toISOString())
                break;
            }
            default:


                return
        }

        let howManyMinutesOff = await client.hgetall('howManyMinutesOff')
        let howManyMinutesOn = await client.hgetall("howManyMinutesOn")
        console.log('la lampadina è stata spenta: ', howManyMinutesOff, "  minuti")
        console.log('la lampadina è stata accesa: ', howManyMinutesOn, "  minuti")
    };

    subscribe(
        {
            streamName: "lightbulb"
        },
        handle
    );

};


/**AGGREATOR CHE LEGGE LO STATO DELLE LAMPADINE E LE SALVE SU ELASTIC */
export async function saveOnElastic() {

    async function handle(msg: LightBulbEvents) {
        const { type } = msg
        switch (type) {
            case "LIGHTBULB_INSTALLED": {
                /**CREO INDEX */
                let elasticSearch = await searchElasticObj(msg);
                const { body } = elasticSearch;
                if (body.error !== undefined) {
                    console.log("ERRORE NON CI SONO LAMPADINE: ", body.error.reason)
                    let newIndex = await createElasticIndex(msg);
                    console.log(newIndex)
                } else {
                    console.log(type, body.hits.hits)
                    // const  deleteObj  = await elastic_Client.indices.delete({
                    //     index: 'lights',
                    // })
                    // console.log(deleteObj)
                }
                break;
            }
            case "LIGHT_TURNED_ON": {
                /**AGGIORNO LO STATE A TRUE*/
                let elasticSearch = await searchElasticObj(msg);
                const { body: { hits: { hits } } } = elasticSearch
                const updateParam: RequestParams.Update = {
                    id: hits[0]._id,
                    index: 'lights',
                    body: { doc: { id: msg.data.id, state: true } }
                };

                let updateElastic = await elastic_Client.update(updateParam);
                return updateElastic

            }
            case "LIGHT_TURNED_OFF": {
                /**AGGIORNO LO STATE A FALSE*/     

                let elasticSearch = await searchElasticObj(msg);
                const { body: { hits: { hits } } } = elasticSearch
                const updateParam: RequestParams.Update = {
                    id: hits[0]._id,
                    index: 'lights',
                    body: { doc: { id: msg.data.id, state: false } }
                };
                // console.log(docParam)

                let updateElastic = await elastic_Client.update(updateParam)

                return updateElastic

            }
                break

            default:
                break;
        }
    }
    subscribe(
        {
            streamName: "lightbulb"
        },
        handle
    );
}

async function searchElasticObj(msg: LightBulbEvents) {

    try {
        const { body } = await elastic_Client.search({
            index: 'lights',
            // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
            body: {
                query: {
                    match: { id: msg.data.id }
                }
            }
        })

        return { body }
    } catch (err) {
        return err;
    }
}
async function createElasticIndex(msg: LightBulbEvents) {

    try {
        const { body } = await elastic_Client.index({
            index: "lights",
            body: {
                id: msg.data.id,
                state: false
            }
        });
        return { body }

    } catch (error) {
        return error
    }
}