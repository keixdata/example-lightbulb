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
const mongoose_1 = __importDefault(require("mongoose"));
const LightSchema = new mongoose_1.Schema({
    id: { type: String, index: { unique: true } },
    state: { type: Boolean }
});
const LightCountSchema = new mongoose_1.Schema({
    id: { type: String, index: { unique: true } },
    count: { type: Number }
});
LightSchema.path("id").validate((value) => __awaiter(this, void 0, void 0, function* () {
    const idCount = yield Lights.countDocuments({
        id: value
    });
    return !idCount;
}), "Light already installed");
//espsorto il mio Schema assegnando a Coin
const Lights = mongoose_1.default.model("Lights", LightSchema);
const LightCount = mongoose_1.default.model("LightCount", LightCountSchema);
function findLigthByIdAndUpdate(id, update) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = { id };
        let newState = { $set: update };
        return yield Lights.findOneAndUpdate(query, newState, { upsert: true });
    });
}
exports.findLigthByIdAndUpdate = findLigthByIdAndUpdate;
function findLightByidAndRemove(id) {
    let query = { id };
    return Lights.findOneAndRemove(query);
}
exports.findLightByidAndRemove = findLightByidAndRemove;
let count = 0;
function resetNumberOfLigths() {
    count = 0;
}
exports.resetNumberOfLigths = resetNumberOfLigths;
function incrementNumberOfLights() {
    count++;
}
exports.incrementNumberOfLights = incrementNumberOfLights;
function readNumberOfLights() {
    return count;
}
exports.readNumberOfLights = readNumberOfLights;
exports.default = Lights;
//# sourceMappingURL=lights.js.map