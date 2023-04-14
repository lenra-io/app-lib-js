import { existsSync } from 'fs';
import { join } from 'path';
import { Api, requestApi } from './Api.js';
import { data, event, ListenerGetter, Manifest, props, ViewGetter } from './types.js';

const RESOURCE_TYPE = "resource";
const LISTENER_TYPE = "action";
const VIEW_TYPE = "view";
const MANIFEST_TYPE = "manifest";

const TYPES = [
    RESOURCE_TYPE,
    LISTENER_TYPE,
    VIEW_TYPE
];
type ViewBody = { view: string, data: data, props: props };
type ListenerBody = { action: string, props: props, event: event, api: requestApi };
type ResourceBody = { resource: string };

const RESOURCES_PATH = "resources";

export class Handler {
    private manifest: Manifest
    private viewGetter: ViewGetter
    private listenerGetter: ListenerGetter
    private resourcesBasePath: string;

    constructor(manifest: Manifest, viewGetter: ViewGetter, listenerGetter: ListenerGetter, resourcesBasePath: string) {
        this.manifest = manifest;
        this.viewGetter = viewGetter;
        this.listenerGetter = listenerGetter;
        this.resourcesBasePath = resourcesBasePath;
    }

    async handleRequest(body: object) {
        const type = TYPES.find(type => type in body) || MANIFEST_TYPE;
        switch (type) {
            case RESOURCE_TYPE:
                return this.handleResource(<ResourceBody>body);
            case LISTENER_TYPE:
                return this.handleListener(<ListenerBody>body);
            case VIEW_TYPE:
                return this.handleView(<ViewBody>body);
            case MANIFEST_TYPE:
                return this.handleManifest();
            default:
                throw new Error(`Unknown request type '${type}'.`);
        }
    }

    private handleManifest() {
        return { manifest: this.manifest };
    }

    private async handleView({ view, data, props }: ViewBody) {
        const fx = await this.viewGetter(view);
        return fx(data || [], props || {});
    }

    private async handleListener({ action, props, event, api }: ListenerBody) {
        const fx = await this.listenerGetter(action);
        return fx(props || {}, event, new Api(api));
    }

    private async handleResource({ resource }: ResourceBody): Promise<File> {
        // Checking file extensions according to which ones Flutter can handle
        if (!resource.match(/.*(\.jpeg|\.jpg|\.png|\.gif|\.webp|\.bmp|\.wbmp)$/))
            throw new Error(`Wrong file format for resource ${resource}`);
        const file = new File(join(this.resourcesBasePath, resource));
        if (!file.exists)
            throw new Error(`Resource file not found ${resource}`);
        return file;
    }
}

export class File {
    path: string
    constructor(path: string) {
        this.path = path;
    }

    get exists() {
        return existsSync(this.path);
    }
}