import * as express from 'express';
import { writeFileSync } from 'fs';
import { File, Handler } from './handler';

export async function serve(handler: Handler) {
    const app = express();

    const defaultMaxSize = '100kb'; // body-parser default

    const rawLimit = process.env.MAX_RAW_SIZE || defaultMaxSize;
    const jsonLimit = process.env.MAX_JSON_SIZE || defaultMaxSize;

    app.disable('x-powered-by');

    app.use(function addDefaultContentType(req, res, next) {
        // When no content-type is given, the body element is set to
        // nil, and has been a source of contention for new users.

        if (!req.headers['content-type']) {
            req.headers['content-type'] = "text/plain"
        }
        next()
    })

    if (process.env.RAW_BODY === 'true') {
        app.use(express.raw({ type: '*/*', limit: rawLimit }))
    } else {
        app.use(express.text({ type: "text/*" }));
        app.use(express.json({ limit: jsonLimit }));
        app.use(express.urlencoded({ extended: true }));
    }

    app.post('/*', async (req, res) => {
        try {
            const result = await handler.handleRequest(req.body);
            if (result instanceof File) {
                res.sendFile(result.path, { root: result.root });
            }
            else if (result) {
                res.status(200).json(result);
            }
            else {
                res.send();
            }
        }
        catch (error) {
            // TODO: Manage different errors depending on type
            console.error(error);
            res.status(500).send(error.message);
        }
    });

    const port = process.env.http_port || 3000;

    app.listen(port, () => {
        writeFileSync("/tmp/.lock", "\n");
        console.log(`App listening on port: ${port}`)
    });
}