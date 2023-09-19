import express from "express";
import { writeFileSync } from 'fs';
import { File, Handler } from './handler.js';
import { App } from "./types.js";
import { AppRequest } from "./gen/request.js";

export default class ExpressServer extends App {
    private readonly app = express();
    private readonly port = process.env.PORT || 3000;
    constructor(handler: Handler) {
        super(handler);

        const defaultMaxSize = '100kb'; // body-parser default

        const rawLimit = process.env.MAX_RAW_SIZE || defaultMaxSize;
        const jsonLimit = process.env.MAX_JSON_SIZE || defaultMaxSize;

        this.app.disable('x-powered-by');

        this.app.use(function addDefaultContentType(req: express.Request, res: express.Response, next: express.NextFunction) {
            // When no content-type is given, the body element is set to
            // nil, and has been a source of contention for new users.

            if (!req.headers['content-type']) {
                req.headers['content-type'] = "text/plain"
            }
            next()
        })

        if (process.env.RAW_BODY === 'true') {
            this.app.use(express.raw({ type: '*/*', limit: rawLimit }))
        } else {
            this.app.use(express.text({ type: "text/*" }));
            this.app.use(express.json({ limit: jsonLimit }));
            this.app.use(express.urlencoded({ extended: true }));
        }
    }

    start(_request?: AppRequest) {
        this.app.post('/*', async (req: express.Request, res: express.Response) => {
            try {
                const result = await this.handler.handleRequest(req.body);
                if (result instanceof File) {
                    res.sendFile(result.path);
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

        this.app.listen(this.port, () => {
            writeFileSync("/tmp/.lock", "\n");
            console.log(`Server started`);
            // console.log(`App listening on port: ${port}`)
        });
    }
}