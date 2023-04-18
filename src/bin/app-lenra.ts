#! /usr/bin/env node

import { join } from 'path';
import { Manifest } from '../lib';
import { loadConf } from '../lib/conf.js';
import { Handler } from '../lib/handler.js';
import { Indexer } from '../lib/indexer.js';
import { serve } from '../lib/server.js';

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
    // load package.json
    const conf = await loadConf();
    // get dir params
    const baseDir = conf.dist;
    // get user manifest
    const manifest: Manifest = await import(join(cwd, baseDir, 'manifest.js'));
    // index views and listeners
    const indexPromise = Indexer.index(await loadConf());
    // define the resources base path
    const resourceBasePath = join(cwd, baseDir, conf.resources);
    // create handler
    const handler = new Handler(manifest, resourceBasePath);
    await indexPromise;
    // create server
    return serve(handler);
}

async function index() {
    return Indexer.index(await loadConf(), true);
}