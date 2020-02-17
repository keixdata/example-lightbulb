"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_store_client_1 = require("@keix/message-store-client");
const run_1 = require("../run");
const uuid_1 = require("uuid");
let stop = () => null;
afterEach(() => {
    stop();
});
// it('should install a light', async () => {
//     const id = v4();
//     // Fake send command.
//     testUtils.setupMessageStore([
//         { stream_name: `lightbulb:command-${id}`, type: "INSTALL_LIGHT", data: { id }, metadata: {} }
//     ])
//     await testUtils.expectIdempotency(run, () => {
//         // Read events, and find the LIGHTBULB_INSTALLED
//         const messages = testUtils.getStreamMessages(`lightbulb-${id}`)
//         expect(messages).toHaveLength(1);
//         expect(messages[0].type).toEqual("LIGHTBULB_INSTALLED")
//     })
// })
it('should turned on', () => __awaiter(this, void 0, void 0, function* () {
    const id = uuid_1.v4();
    const id1 = uuid_1.v4();
    // Fake send command.
    message_store_client_1.testUtils.setupMessageStore([
        { stream_name: `lightbulb:command-${id}`, type: "INSTALL_LIGHT", data: { id }, metadata: {} },
        // { stream_name: `lightbulb-${id}`, type: "LIGHTBULB_INSTALLED", data: { id }, metadata: {} },
        { stream_name: `lightbulb:command-${id}`, type: "TURN_LIGHT_ON", data: { id }, metadata: {} }
    ]);
    stop = yield run_1.run();
    yield message_store_client_1.testUtils.waitForExpect(() => {
        const messages = message_store_client_1.testUtils.getStreamMessages(`lightbulb-${id}`);
        console.log("EVENT STORE:  ", messages);
        //   expect(messages).toHaveLength(1);
    });
}));
//# sourceMappingURL=service.test.js.map