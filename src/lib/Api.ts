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
    constructor(req: requestApi) {
        this.url = req.url;
        this.token = req.token;
    }
    getDoc<T extends Data>(coll: Class<T>, id: string): Promise<T> {
        return axios.get(`${this.url}/app/colls/${Api.collectionName(coll)}/docs/${id}`, this.options())
            .then(resp => fromJson(coll, resp.data));
    }

    createDoc<T extends Data>(doc: T): Promise<T> {
        return axios.post(`${this.url}/app/colls/${Api.dataCollection(doc)}/docs`, doc, this.options())
            .then(resp => <T>resp.data);
    }

    updateDoc<T extends Data>(doc: T): Promise<T> {
        return axios.put(`${this.url}/app/colls/${Api.dataCollection(doc)}/docs/${doc._id}`, doc, this.options())
            .then(resp => <T>resp.data);
    }

    deleteDoc<T extends Data>(doc: T): Promise<void> {
        return axios.delete(`${this.url}/app/colls/${Api.dataCollection(doc)}/docs/${doc._id}`, this.options())
            .then(resp => null);
    }

    executeQuery<T extends Data>(coll: Class<T>, query): Promise<T[]> {
        return axios.post(`${this.url}/app/colls/${Api.collectionName(coll)}/docs/find`, query, this.options())
            .then(resp => resp.data.map(d => fromJson(coll, d)));
    }

    private options() {
        return { headers: this.headers() }
    }

    private headers() {
        return { Authorization: `Bearer ${this.token}` }
    }

    static dataCollection<T extends Data>(data: T): string {
        return this.collectionName<T>(<Class<T>>data.constructor);
    }

    static collectionName<T extends Data>(dataClass: Class<T>): string {
        return dataClass.name.toLowerCase();
    }
}

function fromJson<T extends Data>(dataClass: Class<T>, data: any): T {
    let result: T = new dataClass();
    for (let index in data) {
        if (result.hasOwnProperty(index)) {
            result[index] = data[index]; // care, has to be result
        }
    }
    return result;
}