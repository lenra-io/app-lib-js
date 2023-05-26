import { existsSync } from 'fs';
import { readdir, writeFile } from 'fs/promises';
import { basename, join, relative } from 'path';
import { Conf } from './conf';
import { Listener, View, } from './types';

const cwd = process.cwd();

interface Source {
    module: string
    key: string
    parts: string[]
    name: string
}

const modules = {};
const viewsMap = {};
const listenersMap = {};

function compareSources(a: Source, b: Source) {
    return a.name.localeCompare(b.name);
}

function sourceToNode(source: Source) {
    return `"${source.name}": {module: "${source.module}", key: "${source.key}"}`;
}

function sourceListToNameTree(sources: Source[], base: string[] = []) {
    const keys = [];
    const elements = {};
    sources.forEach(source => {
        const key = source.parts.slice(base.length)[0];
        if (!keys.includes(key)) {
            keys.push(key);
            elements[key] = {
                children: []
            };
        }
        if (source.parts.length == base.length + 1)
            elements[key].main = source;
        else
            elements[key].children.push(source);
    });
    const baseIndent = base.map(_ => '\t').join('');
    return `{
${baseIndent}\t${keys.map(key => `"${key}": ${sourceNodeToNameTree(key, elements[key].main, elements[key].children, base)}`).join(",\n\t" + baseIndent)}
${baseIndent}}`;
}

function sourceNodeToNameTree(key: string, main: Source, children: Source[], base: string[]) {
    if (main && children.length === 0) return `"${main.name}"`;
    const subtree = sourceListToNameTree(children, [...base, key]);
    if (!main) return subtree;
    return `{...${subtree}, toJSON: () => "${main.name}"}`;
}

export abstract class Indexer {
    async index(conf: Conf, writeIndexFile: boolean = false) {
        const sourceDir = await this.indexSourceDir(conf);
        const views = await this.indexDirectory(viewsMap, [], join(sourceDir, conf.views));
        const listeners = await this.indexDirectory(listenersMap, [], join(sourceDir, conf.listeners));

        if (writeIndexFile) {
            const indexPath = join(await this.indexTargetDir(conf), `index.gen.${this.ext}`);
            await writeFile(indexPath, await this.generateFileContent(views, listeners));
            console.log("Wrote", indexPath);
        }
    }

    async indexSourceDir(conf: Conf) {
        return join(cwd, conf.dist);
    }

    async indexTargetDir(conf: Conf) {
        return join(cwd, conf.src);
    }

    protected async indexDirectory(indexedMap: { [key: string]: View | Listener }, parts: string[], dir: string): Promise<Source[]> {
        if (!existsSync(dir)) return [];
        const files = await readdir(dir, { withFileTypes: true });
        const sourcePromises = files.map(async file => {
            const path = join(dir, file.name);
            if (file.isDirectory()) return this.indexDirectory(indexedMap, [...parts, file.name], path);
            else if (file.isFile() && file.name.endsWith('.js')) return this.indexFile(indexedMap, parts.slice(), path);
            console.log("Not manageable file", path);
            return [];
        });
        return (await Promise.all(sourcePromises)).flat();
    }

    protected async indexFile(indexedMap: { [key: string]: Function }, parts: string[], file: string): Promise<Source[]> {
        const module = await import(file);
        let fileName = basename(file);
        fileName = fileName.substring(0, fileName.lastIndexOf('.'));
        const asDefault = !!module.default;
        if (asDefault) {
            parts.push(fileName);
        }
        const baseName = parts.join('.');
        return Object.entries(module)
            .filter(([_key, value]) => value instanceof Function)
            .map(([key, func]) => {
                let name = baseName;
                let childParts = parts.slice();
                if (key !== "default") {
                    if (asDefault) name += `::${key}`;
                    else {
                        if (childParts.length > 0) name += ".";
                        name += key;
                    }
                    childParts.push(key);
                }
                if (name in indexedMap) throw new Error(`At least two elements match the name '${name}'`);
                indexedMap[name] = func as Function;
                return {
                    module: file,
                    key,
                    parts: childParts,
                    name
                };
            });
    }

    protected abstract get ext(): string;

    protected abstract generateFileContent(views: Source[], listeners: Source[]): Promise<string>;

    static async index(conf: Conf, writeIndexFile: boolean = false) {
        const indexer = indexers[conf.indexer];
        if (!indexer) throw new Error(`Indexer not found for name '${conf.indexer}'`);
        await indexer.index(conf, writeIndexFile);
    }
}

export class JavaScriptIndexer extends Indexer {
    get ext(): string {
        return "js";
    }
    async generateFileContent(views: Source[], listeners: Source[]): Promise<string> {
        views.sort(compareSources);
        listeners.sort(compareSources);
        return `export const views = ${sourceListToNameTree(views)};
export const listeners = ${sourceListToNameTree(listeners)};
`;
    }

}

export class TypeScriptIndexer extends JavaScriptIndexer {
    get ext(): string {
        return "ts";
    }
}

const jsIndexer = new JavaScriptIndexer();
const tsIndexer = new TypeScriptIndexer();

export const indexers: { [key: string]: Indexer } = {
    js: jsIndexer,
    javascript: jsIndexer,
    ts: tsIndexer,
    typescript: tsIndexer,
};

export function getView(name: string) {
    const view = viewsMap[name];
    if (!view) throw new Error('No view found for ' + name);
    return view;
}

export function getListener(name: string) {
    const listener = listenersMap[name];
    if (!listener) throw new Error('No listener found for ' + name);
    return listener;
}
