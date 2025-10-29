import { environment } from "src/environments/environment";
import { UtilsService } from "./utils.service";
import Parse from 'parse';

// Initialize the minimum requirements for the app
export function AppConfig(utils: UtilsService): () => Promise<any> {
    return () => new Promise(async (res, rej) => {
        const appid = environment.server.appId
        const server = await utils.getServer();
        Parse.initialize(appid || "", "");
        Parse.serverURL = server || "";
        res(true)
    })
}