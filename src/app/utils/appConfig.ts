import { UtilsService } from "./utils.service";
import Parse from 'parse';

// Initialize the minimum requirements for the app
export function AppConfig(utils: UtilsService): () => Promise<any> {
    return () => new Promise(async (res, rej) => {
        const appid = process.env["NG_APP_APPID"];
        const server = await utils.getServer();
        Parse.initialize(appid || "");
        Parse.serverURL = server || "";
        res(true)
    })
}