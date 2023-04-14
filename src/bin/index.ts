#! /usr/bin/env node

import * as fs from 'fs/promises';
import { loadConf } from '../lib/conf';

const args = process.argv.slice(2);
const cwd = process.cwd();

run();

async function run() {
    const conf = await loadConf();
    const LISTENERS_DIR = "listeners";
    const LISTENERS_PATH = `${conf.src}/${LISTENERS_DIR}`;
    const VIEWS_DIR = "views";
    const VIEWS_PATH = `${conf.src}/${VIEWS_DIR}`;

    Promise.all([indexListeners(), indexViews()])
        .then(writeIndexFile);

    async function indexListeners() {
        // Get all the files in the src/listeners dir
        const listenerFiles = await fs.readdir(LISTENERS_PATH);
        // Import each one
        const promises = listenerFiles
            .map(file => file.replace(/\.ts$/, ""))
            .map(async file => {
                const mod = await import(`./${LISTENERS_PATH}/${file}`);
                const entries = Object.entries(mod)
                    .filter(([key, value]) => value instanceof Function)
                    .map(([key, value]) => {
                        const listener = {
                            module: `./${LISTENERS_DIR}/${file}`,
                            key
                        }
                        if (key == "default") return {
                            // add it with the name of the file
                            key: file,
                            value: listener
                        }
                        // add all the exported functions with the name of the function
                        return { key, value: listener };
                    });
                return entries;
            });
        return Object.fromEntries(
            (await Promise.all(promises))
                .flat()
                .map(({ key, value }) => [key, value])
        );
    }

    async function indexViews() {
        // Get all the files in the src/views dir
        const viewFiles = await fs.readdir(VIEWS_PATH);
        // Import each one
        const promises = viewFiles
            .map(file => file.replace(/\.ts$/, ""))
            .map(async file => {
                const mod = await import(`./${VIEWS_PATH}/${file}`);
                const entries = Object.entries(mod)
                    .filter(([key, value]) => value instanceof Function)
                    .map(([key, value]) => {
                        const view = {
                            module: `./${VIEWS_DIR}/${file}`,
                            key
                        }
                        if (key == "default") return {
                            // add it with the name of the file
                            key: file,
                            value: view
                        }
                        // add all the exported functions with the name of the file concatenated with the name of the function
                        return {
                            key: `${file}:${key}`,
                            value: view
                        };
                    });
                return entries;
            });
        return Object.fromEntries(
            (await Promise.all(promises))
                .flat()
                .map(({ key, value }) => [key, value])
        );
    }

    async function writeIndexFile([listeners, views]) {
        return fs.writeFile("src/index.gen.ts",
            `import { View, Listener } from "./classes/types";

const listenersCache = ${JSON.stringify(listeners)};
export async function getListener(name): Promise<Listener> {
    let listener = listenersCache[name];
    if (!listener) throw new Error(\`No listener defined for the name '\${name}'\`);
    if (!(listener instanceof Function)) {
        const mod = await import(listener.module);
        listener = mod[listener.key];
    }
    return listener;
}
export const listeners = { ${Object.keys(listeners)
                .map(name => `${name}: "${name}"`)
                .join(', ')} };

const viewsCache = ${JSON.stringify(views)};
export async function getView(name): Promise<View> {
    let view = viewsCache[name];
    if (!view) throw new Error(\`No view defined for the name '\${name}'\`);
    if (!(view instanceof Function)) {
        const mod = await import(view.module);
        view = mod[view.key];
    }
    return view;
}
export const views = { ${Object.keys(views)
                .map(name => `${name}: "${name}"`)
                .join(', ')} };
`
        );
    }

}