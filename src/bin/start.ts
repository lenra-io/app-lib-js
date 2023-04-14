#! /usr/bin/env node

import { join } from 'path';
import { Manifest } from '../lib';
import { loadConf } from '../lib/conf.js';
import { Handler } from '../lib/handler.js';
import { serve } from '../lib/server.js';

const args = process.argv.slice(2);
const cwd = process.cwd();

run();

async function run() {
    // load package.json
    const conf = await loadConf();
    console.log("conf", conf);
    // get dir params
    const baseDir = conf.dist;
    console.log("baseDir", baseDir);
    // get user manifest
    const manifest: Manifest = await import(join(cwd, baseDir, 'manifest.js'));
    console.log("manifest", manifest);
    // load app index.gen
    const index = await import(join(cwd, baseDir, 'index.gen.js'));
    console.log(join(cwd, baseDir, 'index.gen.js'), index);
    const { getView, getListener } = index;
    console.log("index.gen", getView, getListener);
    const resourceBasePath = join(cwd, baseDir, conf.resources);
    console.log("resourceBasePath", resourceBasePath);
    // create handler
    const handler = new Handler(manifest, getView, getListener, resourceBasePath);
    // create server
    serve(handler);
}