import * as fs from 'fs/promises';
import { join } from 'path';

const cwd = process.cwd();

export interface Conf {
    app?: string
    views: string;
    listeners: string
    resources: string
    src: string
    dist: string
    indexer: string
}

const defaultConf = {
    views: "views",
    listeners: "listeners",
    src: "src",
    dist: null,
    resources: "resources",
    indexer: "js",
};

export async function loadConf(): Promise<Conf> {
    const { "app-lenra": packageConf } = JSON.parse(await fs.readFile(join(cwd, "package.json"), "utf-8"));
    const conf = {
        ...defaultConf,
        ...packageConf
    };
    // TODO: deep merging only for conf in defaultConf
    if (!conf.dist) conf.dist = conf.src;
    return conf;
}