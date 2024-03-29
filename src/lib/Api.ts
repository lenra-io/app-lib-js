import { Data } from "./Data.js";
import { ListenerRequest } from "./gen/request.js";
import createClient from "openapi-fetch";
import { paths } from "./gen/api.js";
import { Options } from "./gen/manifest.js";

export type Class<T> = { new(...args: any[]): T; };

export class Api {
    readonly url: string;
    readonly token: string;
    readonly data: DataApi;
    constructor(req: ListenerRequest["api"], readonly client = createClient<paths>({ baseUrl: req.url })) {
        this.url = req.url;
        this.token = req.token;
        this.data = new DataApi(this);
    }
}

abstract class ApiPart {
    constructor(readonly api: Api) {
        this.api = api;
    }

    headers() {
        return { Authorization: `Bearer ${this.api.token}` }
    }
}

class Collection {
    constructor(private readonly api: AbstractDataApi, private readonly name: string) { }

    // CRUD
    getDoc(id: string) {
        return this.api.api.client.GET(
            "/app-api/v1/data/colls/{coll}/docs/{id}",
            {
                params: {
                    path: {
                        coll: this.name,
                        id: id
                    }
                },
                headers: this.api.headers()
            }
        ).then(resp => resp.data);
    }

    createDoc(doc: any) {
        return this.api.api.client.POST(
            "/app-api/v1/data/colls/{coll}/docs",
            {
                params: {
                    path: {
                        coll: this.name
                    }
                },
                body: doc,
                headers: this.api.headers()
            }
        ).then(resp => resp.data);
    }

    updateDoc(doc: any) {
        return this.api.api.client.PUT(
            "/app-api/v1/data/colls/{coll}/docs/{id}",
            {
                params: {
                    path: {
                        coll: this.name,
                        id: doc._id
                    }
                },
                body: doc,
                headers: this.api.headers()
            }
        ).then(resp => resp.data);
    }

    deleteDoc(id: string) {
        return this.api.api.client.DELETE(
            "/app-api/v1/data/colls/{coll}/docs/{id}",
            {
                params: {
                    path: {
                        coll: this.name,
                        id
                    }
                },
                headers: this.api.headers()
            }
        ).then(resp => resp.data);
    }

    // Mongo functions
    find(query: {[key: string]: any}, projection?: {[key: string]: any}, options?: Options) {
        return this.api.api.client.POST(
            "/app-api/v1/data/colls/{coll}/find",
            {
                params: {
                    path: {
                        coll: this.name
                    }
                },
                body: {
                    query,
                    projection,
                    options
                },
                headers: this.api.headers()
            }
        ).then(resp => resp.data);
    }

    insertMany(documents: any[]) {
        return this.api.api.client.POST(
            "/app-api/v1/data/colls/{coll}/insertMany",
            {
                params: {
                    path: {
                        coll: this.name
                    }
                },
                body: {
                    documents
                },
                headers: this.api.headers()
            }
        ).then(resp => resp.data);
    }

    updateMany(filter: any, update: any) {
        return this.api.api.client.POST(
            "/app-api/v1/data/colls/{coll}/updateMany",
            {
                params: {
                    path: {
                        coll: this.name
                    }
                },
                body: {
                    filter,
                    update
                },
                headers: this.api.headers()
            }
        ).then(resp => resp.data);
    }
}

class TypedCollection<D extends Data, T extends Class<D>> {
    private readonly collection: Collection;
    constructor(api: AbstractDataApi, private readonly collClass: T) {
        this.collection = new Collection(api, DataApi.collectionName(collClass));
    }

    async getDoc(id: string): Promise<D> {
        const resp = await this.collection.getDoc(id);
        return AbstractDataApi.fromJson(this.collClass, resp);
    }

    async createDoc(doc: D): Promise<D> {
        const resp = await this.collection.createDoc(doc);
        return AbstractDataApi.fromJson(this.collClass, resp);
    }

    async updateDoc(doc: D): Promise<D> {
        const resp = await this.collection.updateDoc(doc);
        return AbstractDataApi.fromJson(this.collClass, resp);
    }

    async deleteDoc(doc: D): Promise<void> {
        await this.collection.deleteDoc(doc._id);
    }

    async find(query: {[key: string]: any}, projection?: {[key: string]: any}, options?: Options): Promise<D[]> {
        const resp = await this.collection.find(query, projection, options);
        return resp.map((d: any) => AbstractDataApi.fromJson(this.collClass, d));
    }

    async insertMany(documents: D[]): Promise<void> {
        await this.collection.insertMany(documents);
    }

    async updateMany(filter: any, update: any): Promise<void> {
        await this.collection.updateMany(filter, update);
    }
}

abstract class AbstractDataApi extends ApiPart {
    private readonly collections: { [name: string]: Collection } = {};
    private readonly typedCollections: { [name: string]: TypedCollection<Data, Class<Data>> } = {};

    coll(name: string): Collection
    coll<D extends Data>(collClass: Class<D>): TypedCollection<D, Class<D>>
    coll<D extends Data>(arg1: string | Class<D>) {
        if (typeof arg1 === "string") {
            if (!this.collections[arg1]) {
                this.collections[arg1] = new Collection(this, arg1);
            }
            return this.collections[arg1];
        } else {
            const name = DataApi.collectionName(arg1);
            if (!this.typedCollections[name]) {
                this.typedCollections[name] = new TypedCollection(this, arg1);
            }
            return this.typedCollections[name];
        }
    }

    static fromJson<T extends Data>(dataClass: Class<T>, data: any): T {
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
        return this.api.client.POST(
            "/app-api/v1/data/transaction",
            {
                headers: this.headers()
            }
        ).then(resp => new Transaction(this.api, resp.data));
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

    headers(): { Authorization: string; } {
        return { Authorization: `Bearer ${this.token}` };
    }

    async commit() {
        await this.api.client.POST(
            "/app-api/v1/data/transaction/commit",
            {
                headers: this.headers()
            }
        );
    }

    async abort() {
        await this.api.client.POST(
            "/app-api/v1/data/transaction/abort",
            {
                headers: this.headers()
            }
        );
    }
}
