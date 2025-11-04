import Parse from 'parse';

export abstract class UserData {
    data: any = [];
    type: string = "";
    user: any;
    limit: number = 0;
    
    constructor(type: string, limit: number = 0) {
        this.type = type;
        this.limit = limit;
        this.getData()
    }

    public get() {
        if(this.isSame()) return this.data;
        else return this.getData()
    }
    private isSame() {
        const currentNow: any = Parse.User.current()
        return this.user === undefined && !currentNow || this.user && currentNow && this.user.id === currentNow.id;
    }
    private getData() {
        this.user = Parse.User.current()
        let data;
        if(this.user) {
            data = this.user.get(this.type)
            if(!data) data = []
        } else {
            data = JSON.parse(localStorage.getItem(this.type) || "[]");
        }
        this.data = data;
        return data;
    }
    private save() {
        if(this.user) {
            this.user.set(this.type, this.data)
            this.user.save()
        } else {
            localStorage.setItem(this.type, JSON.stringify(this.data))
        }
    }

    public add(item: any, last?: boolean) {
        const isLimited = this.limit > 0;
        const isOverLimit = this.data.length >= this.limit;
        if(last === true) {
            this.data.push(item);
            if(isLimited && isOverLimit) this.data.shift();
        } else {
            this.data.unshift(item);
            if(isLimited && isOverLimit) this.data.pop();
        }
        this.save()
    }

    public removeByIndex(index: number) {
        this.data.splice(index, 1);
        this.save()
    }
    public removeById(id: string) {
        let index = this.data.findIndex(id);
        this.removeByIndex(index);
    }

}