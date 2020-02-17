import { testUtils } from '@keix/message-store-client';
import { run } from "../run"
import { v4 } from 'uuid';

let stop: Function = () => null;
afterEach(() => {
    stop();
})

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

it('should turned on', async () => {
    const id = v4();
    const id1 = v4();
    // Fake send command.
    testUtils.setupMessageStore([
        { stream_name: `lightbulb:command-${id}`, type: "INSTALL_LIGHT", data: { id }, metadata: {} },
        // { stream_name: `lightbulb-${id}`, type: "LIGHTBULB_INSTALLED", data: { id }, metadata: {} },
        { stream_name: `lightbulb:command-${id}`, type: "TURN_LIGHT_ON", data: { id }, metadata: {} }
    ]);



    stop = await run();

    await testUtils.waitForExpect(() => {

        const messages = testUtils.getStreamMessages(`lightbulb-${id}`);
    
        console.log("EVENT STORE:  ",messages)
    
        //   expect(messages).toHaveLength(1);
    })

})