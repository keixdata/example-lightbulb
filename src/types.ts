import { Message } from "@keix/message-store-client"

export type LightbulbData = { id: string };
export type LightbulbCommands = | Message<"TURN_LIGHT_ON", LightbulbData>
    | Message<"INSTALL_LIGHT", LightbulbData>
    | Message<"TURN_LIGHT_OFF", LightbulbData> | Message<"UNINSTALL_LIGHT", LightbulbData>;
export type LightBulbEvents = | Message<"LIGHTBULB_INSTALLED", LightbulbData> | Message<"LIGHT_TURNED_ON", LightbulbData> | Message<"LIGHT_TURNED_OFF", LightbulbData> | Message<"LIGHT_UNINSTALLED", LightbulbData>
export type myCallback = (err: any, event: any) => String;
