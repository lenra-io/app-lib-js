import { existsSync } from 'fs';
import { join } from 'path';
import { Api } from './Api';
import { getListener, getView } from './indexer';
import { AppRequest, ListenerRequest, ResourceRequest, ViewRequest } from './gen/request.js';
import { Manifest } from './gen/manifest.js';

const RESOURCE_TYPE = "resource";
const LISTENER_TYPE = "listener";
const VIEW_TYPE = "view";
const MANIFEST_TYPE = "manifest";

const TYPES = [
    RESOURCE_TYPE,
    LISTENER_TYPE,
    VIEW_TYPE
];

const RESOURCES_PATH = "resources";

export class Handler {
    private manifest: Manifest
    private resourcesBasePath: string;

    constructor(manifest: Manifest, resourcesBasePath: string) {
        this.manifest = manifest;
        this.resourcesBasePath = resourcesBasePath;
    }

    async handleRequest(body: AppRequest) {
        const type = TYPES.find(type => type in body) || MANIFEST_TYPE;
        switch (type) {
            case RESOURCE_TYPE:
                return this.handleResource(<ResourceRequest>body);
            case LISTENER_TYPE:
                return this.handleListener(<ListenerRequest>body);
            case VIEW_TYPE:
                return this.handleView(<ViewRequest>body);
            case MANIFEST_TYPE:
                return this.handleManifest();
            default:
                throw new Error(`Unknown request type '${type}'.`);
        }
    }

    private handleManifest() {
        return this.manifest;
    }

    private async handleView({ view, data, props, context }: ViewRequest) {
        const fx = await getView(view);
        return fx(data || [], props || {}, context || {});
    }

    private async handleListener({ listener, props, event, api }: ListenerRequest) {
        const fx = await getListener(listener);
        return fx(props || {}, event, new Api(api));
    }

    private async handleResource({ resource }: ResourceRequest): Promise<File> {
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