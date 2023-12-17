import { constants } from "./constants";


export class AuthGuard{
    public hasSelectedCity() {
        return localStorage.getItem(constants.keys.city) !== null
    }
}