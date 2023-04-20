import axios from "axios";
import { Data } from "./Data";

export type requestApi = {
    url: string,
    token: string
};

export type Class<T> = { new(...args: any[]): T; };

export class Api {
    readonly url;
    readonly token;
    readonly data: DataApi;
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

export class DataApi extends ApiPart {
    getDoc<T extends Data>(coll: Class<T>, id: string): Promise<T> {
        return axios.get(`${this.api.url}/app/colls/${DataApi.collectionName(coll)}/docs/${id}`, this.options())
            .then(resp => DataApi.fromJson(coll, resp.data));
    }

    createDoc<T extends Data>(doc: T): Promise<T> {
        return axios.post(`${this.api.url}/app/colls/${DataApi.dataCollection(doc)}/docs`, doc, this.options())
            .then(resp => <T>resp.data);
    }

    updateDoc<T extends Data>(doc: T): Promise<T> {
        return axios.put(`${this.api.url}/app/colls/${DataApi.dataCollection(doc)}/docs/${doc._id}`, doc, this.options())
            .then(resp => <T>resp.data);
    }

    deleteDoc<T extends Data>(doc: T): Promise<void> {
        return axios.delete(`${this.api.url}/app/colls/${DataApi.dataCollection(doc)}/docs/${doc._id}`, this.options())
            .then(resp => null);
    }

    find<T extends Data>(coll: Class<T>, query: any): Promise<T[]> {
        return axios.post(`${this.api.url}/app/colls/${DataApi.collectionName(coll)}/docs/find`, query, this.options())
            .then(resp => resp.data.map(d => DataApi.fromJson(coll, d)));
    }

    static dataCollection<T extends Data>(data: T): string {
        return this.collectionName<T>(<Class<T>>data.constructor);
    }

    static collectionName<T extends Data>(dataClass: Class<T>): string {
        return dataClass.name.toLowerCase();
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
