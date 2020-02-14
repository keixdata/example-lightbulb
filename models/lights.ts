import mongoose, { Schema } from 'mongoose';
import {myCallback} from '../types'


const LightSchema = new Schema({
    id: { type: String, index: { unique: true } },
    state: { type: Boolean }
});


LightSchema.path("id").validate(async (value: String) => {
    const idCount = await Lights.countDocuments({
        id: value
    });
    return !idCount;
}, "Light already installed");

//espsorto il mio Schema assegnando a Coin
const Lights = mongoose.model("Lights", LightSchema);

export async function findLigthByIdAndUpdate(id: String, update: Object) {
    let query = { id };
    let newState = { $set: update };
    return await Lights.findOneAndUpdate(query, newState, { upsert: true });
}

export function findLightByidAndRemove(id: String) {
    let query = { id }
    return Lights.findOneAndRemove(query);
}

export default Lights;