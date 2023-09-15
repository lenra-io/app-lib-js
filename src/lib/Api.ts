import axios from "axios";
import { Data } from "./Data";

export type requestApi = {
    url: string,
    token: string
};

export type Class<T> = { new(...args: any[]): T; };

export class Api {
    readonly url: string;
    readonly token: string;
    readonly data: AbstractDataApi;
    constructor(req: requestApi) {
        this.url = req.url;
        this.token = req.token;
        this.data = new DataApi(this);
    }
}

abstract class ApiPart {
    readonly api: Api;
    constructor(api: Api) {
        this.api = api;
    }

    protected options() {
        return { headers: this.headers() }
    }

    protected headers() {
        return { Authorization: `Bearer ${this.api.token}` }
    }
}

abstract class AbstractDataApi extends ApiPart {
    getDoc<T extends Data>(coll: Class<T>, id: string): Promise<T> {
        return axios.get(`${this.api.url}/app/colls/${DataApi.collectionName(coll)}/docs/${id}`, this.options())
            .then(resp => AbstractDataApi.fromJson(coll, resp.data));
    }

    createDoc<T extends Data>(doc: T): Promise<T> {
        return axios.post(`${this.api.url}/app/colls/${DataApi.dataCollection(doc)}/docs`, doc, this.options())
            .then(resp => <T>resp.data);
    }

    updateDoc<T extends Data>(doc: T): Promise<T> {
        return axios.put(`${this.api.url}/app/colls/${DataApi.dataCollection(doc)}/docs/${doc._id}`, doc, this.options())
            .then(resp => {
                console.log(resp);
                return <T>resp.data
            });
    }

    deleteDoc<T extends Data>(doc: T): Promise<void> {
        return axios.delete(`${this.api.url}/app/colls/${DataApi.dataCollection(doc)}/docs/${doc._id}`, this.options())
            .then(resp => null);
    }

    find<T extends Data>(coll: Class<T>, query: any): Promise<T[]> {
        return axios.post(`${this.api.url}/app/colls/${DataApi.collectionName(coll)}/docs/find`, query, this.options())
            .then(resp => resp.data.map(d => AbstractDataApi.fromJson(coll, d)));
    }

    private static fromJson<T extends Data>(dataClass: Class<T>, data: any): T {
        let result: T = new dataClass();
        for (let index in data) {
            if (result.hasOwnProperty(index)) {
                result[index] = data[index];
            }
        }
        return result;
    }
}

export class DataApi extends AbstractDataApi {
    startTransaction(): Promise<Transaction> {
        return axios.post(`${this.api.url}/app/transaction`, {}, this.options())
            .then(resp => new Transaction(this.api, resp.data));
    }

    static dataCollection<T extends Data>(data: T): string {
        return this.collectionName<T>(<Class<T>>data.constructor);
    }

    static collectionName<T extends Data>(dataClass: Class<T>): string {
        return dataClass.name.toLowerCase();
    }
}

export class Transaction extends AbstractDataApi {
    readonly token: string;

    constructor(api: Api, token: string) {
        super(api);
        this.token = token;
    }

    protected headers(): { Authorization: string; } {
        return { Authorization: `Bearer ${this.token}` };
    }

    commit(): Promise<void> {
        return axios.post(`${this.api.url}/app/transaction/commit`, {}, this.options())
            .then(_resp => null);
    }

    abort(): Promise<void> {
        return axios.post(`${this.api.url}/app/transaction/abort`, {}, this.options())
            .then(_resp => null);
    }
}
