const moduleCache = {};

async function loadSource({ module, key }) {
    let mod = moduleCache[module];
    if (!mod) {
        mod = await import(module);
        moduleCache[module] = mod;
    }
    return mod[key];
}

const listenersCache = {};

export async function getListener(name) {
    let listener = listenersCache[name];
    if (!listener) throw new Error(`No listener defined for the name '${name}'`);
    return listener;
}
export const listeners = Object.fromEntries(Object.keys(listenersCache).map(key => [key, key]));

const viewsCache = {};

export async function getView(name) {
    let view = viewsCache[name];
    if (!view) throw new Error(`No view defined for the name '${name}'`);
    return view;
}
export const views = Object.fromEntries(Object.keys(listenersCache).map(key => [key, key]));
