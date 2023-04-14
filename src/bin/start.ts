#! /usr/bin/env node

import * as fs from 'fs/promises';
import { join } from 'path';
import { Manifest } from '../lib';
import { loadConf } from '../lib/conf';
import { Handler } from '../lib/handler';
import { serve } from '../lib/server';

const args = process.argv.slice(2);
const cwd = process.cwd();

const SOURCE_DIR = "src";

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
    const { getView, getListener } = await import(join(cwd, baseDir, 'index.gen.js'));
    console.log("index.gen", getView, getListener);
    // create handler
    const handler = new Handler(manifest, getView, getListener);
    // create server
    serve(handler);
}