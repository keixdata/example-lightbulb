import { run } from './run'
import { howLongOn, howManyLightsInstalled,saveOnElastic } from './aggregators'


/*
for any event:
    id, timestamp, type = event
    if in redis lights_states id = id?
        se si, get prev event





*/

// run();
// howManyLightsInstalled();

// howLongOn();
saveOnElastic()