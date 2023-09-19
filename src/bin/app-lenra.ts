#! /usr/bin/env node

import { join } from 'path';
import { Manifest } from '../lib/index.js';
import { loadConf } from '../lib/conf.js';
import { Handler } from '../lib/handler.js';
import { Indexer } from '../lib/indexer.js';
import ExpressServer from '../lib/server.js';

const args = process.argv.slice(2);
const cwd = process.cwd();

run(args[0] || 'start').catch(e => {
    console.error(e);
});

async function run(command: string) {
    console.log("Run command", command);
    switch (command) {
        case "start":
        case "serve":
            return start();
        case "index":
            return index();
        default:
            throw new Error(`No matching command for ${command}`);
    }
}

async function start() {
    // load packageon
    const conf = await loadConf();
    // get dir params
    const baseDir = conf.dist;
    // get user manifest
    const manifest: Manifest = await import(join(cwd, baseDir, `manifest.${conf.indexer}`));
    // index views and listeners
    const indexPromise = Indexer.index(conf);
    // define the resources base path
    const resourceBasePath = join(cwd, baseDir, conf.resources);
    // create handler
    const handler = new Handler(manifest, resourceBasePath);
    // get app class
    const appClass = conf.app ? await import(join(cwd, baseDir, conf.app)) : ExpressServer;
    // wait for indexing
    await indexPromise;
    // create app
    const app = new appClass(handler);
    app.start();
}

async function index() {
    return Indexer.index(await loadConf(), true);
}