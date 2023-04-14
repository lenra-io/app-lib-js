import * as fs from 'fs/promises';
import { join } from 'path';

const cwd = process.cwd();

export interface Conf {
    resources: string;
    src: string
    dist: string
}

const defaultConf = {
    src: "src",
    resources: "resources",
};

export async function loadConf(): Promise<Conf> {
    const { "app-lenra": packageConf } = JSON.parse(await fs.readFile(join(cwd, "package.json"), "utf-8"));
    const conf = {
        ...defaultConf,
        ...packageConf
    };
    if (!("dist" in conf)) conf.dist = conf.src;
    return conf;
}