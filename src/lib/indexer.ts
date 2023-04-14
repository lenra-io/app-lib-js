import { Conf } from './conf';

interface Source {
    module: string
    elements: { [key: string]: string }
}

interface Index {
    views: Source[]
}

export abstract class Indexer {
    async index(conf: Conf) {
        // conf
    }

    async indexDirectory(dir: string): Promise<Source[]> {
        return null;
    }

    abstract indexFile(file: string): Promise<Source>;
}

export class JavaScriptIndexer extends Indexer {
    async indexFile(file: string): Promise<Source> {
        throw new Error('Method not implemented.');
    }

}

export class TypeScriptIndexer extends JavaScriptIndexer {

}