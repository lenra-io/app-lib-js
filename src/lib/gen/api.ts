/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/app-api/v1-api/v1/data/colls/{coll}": {
    /** Deletes a collection from database */
    delete: operations["deleteCollection"];
  };
  "/app-api/v1/data/colls/{coll}/docs": {
    /** Gets documents from database */
    get: operations["getDocuments"];
    /** Creates one document in database */
    post: operations["createDocument"];
  };
  "/app-api/v1/data/colls/{coll}/docs/{id}": {
    /** Gets a document from database */
    get: operations["getDocumentById"];
    /** Updates a document in database */
    put: operations["updateDocumentById"];
    /** Deletes a document from database */
    delete: operations["deleteDocumentById"];
  };
  "/app-api/v1/data/colls/{coll}/find": {
    /** Finds documents in database */
    post: operations["findDocuments"];
  };
  "/app-api/v1/data/colls/{coll}/insertMany": {
    /** Inserts many documents in database */
    post: operations["insertManyDocuments"];
  };
  "/app-api/v1/data/colls/{coll}/updateMany": {
    /** Updates many documents in database */
    post: operations["updateManyDocuments"];
  };
  "/app-api/v1/data/transaction": {
    /** Creates a transaction */
    post: operations["createTransaction"];
  };
  "/app-api/v1/data/transaction/commit": {
    /** Commits a transaction */
    post: operations["commitTransaction"];
  };
  "/app-api/v1/data/transaction/abort": {
    /** Aborts a transaction */
    post: operations["abortTransaction"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    /**
     * Document
     * @description A document in MongoDB database
     */
    "data.document": {
      [key: string]: unknown;
    };
    /**
     * Query
     * @description Mongo data query
     */
    "data.query": {
      [key: string]: unknown;
    };
    /**
     * FindResult
     * @description Find query result.
     */
    "data.result.find": {
      [key: string]: unknown;
    };
    /**
     * Query
     * @description Mongo data query
     */
    "data.update": {
      [key: string]: unknown;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {

  /** Deletes a collection from database */
  deleteCollection: {
    parameters: {
      path: {
        /** @description The document collection name */
        coll: string;
      };
    };
    responses: {
      /** @description Collection deleted */
      200: {
        content: never;
      };
    };
  };
  /** Gets documents from database */
  getDocuments: {
    parameters: {
      path: {
        /** @description The document collection name */
        coll: string;
      };
    };
    responses: {
      /** @description Documents found */
      200: {
        content: {
          "application/json": components["schemas"]["data.document"][];
        };
      };
    };
  };
  /** Creates one document in database */
  createDocument: {
    parameters: {
      path: {
        /** @description The document collection name */
        coll: string;
      };
    };
    /** @description The document to create */
    requestBody: {
      content: {
        "application/json": Record<string, never>;
      };
    };
    responses: {
      /** @description Document created */
      200: {
        content: {
          "application/json": components["schemas"]["data.document"];
        };
      };
    };
  };
  /** Gets a document from database */
  getDocumentById: {
    parameters: {
      path: {
        /** @description The document collection name */
        coll: string;
        /** @description The document identifier */
        id: string;
      };
    };
    responses: {
      /** @description Document created */
      200: {
        content: {
          "application/json": components["schemas"]["data.document"];
        };
      };
    };
  };
  /** Updates a document in database */
  updateDocumentById: {
    parameters: {
      path: {
        /** @description The document collection name */
        coll: string;
        /** @description The document identifier */
        id: string;
      };
    };
    /** @description The document to update */
    requestBody: {
      content: {
        "application/json": components["schemas"]["data.document"];
      };
    };
    responses: {
      /** @description Document updated */
      200: {
        content: {
          "application/json": components["schemas"]["data.document"];
        };
      };
    };
  };
  /** Deletes a document from database */
  deleteDocumentById: {
    parameters: {
      path: {
        /** @description The document collection name */
        coll: string;
        /** @description The document identifier */
        id: string;
      };
    };
    responses: {
      /** @description Document deleted */
      200: {
        content: {
          "application/json": components["schemas"]["data.document"];
        };
      };
    };
  };
  /** Finds documents in database */
  findDocuments: {
    parameters: {
      path: {
        /** @description The document collection name */
        coll: string;
      };
    };
    /** @description The query to find documents */
    requestBody: {
      content: {
        "application/json": {
          query: components["schemas"]["data.query"];
          projection?: {
            [key: string]: unknown;
          } | null;
          options?: {
            limit?: number | null;
            skip?: number | null;
          };
        };
      };
    };
    responses: {
      /** @description Documents found */
      200: {
        content: {
          "application/json": components["schemas"]["data.result.find"];
        };
      };
    };
  };
  /** Inserts many documents in database */
  insertManyDocuments: {
    parameters: {
      path: {
        /** @description The documents collection name */
        coll: string;
      };
    };
    /** @description The documents to create */
    requestBody: {
      content: {
        "application/json": {
          documents: {
              [key: string]: unknown;
            }[];
        };
      };
    };
    responses: {
      /** @description Documents inserted */
      200: {
        content: {
          "application/json": {
            insertedIds: string[];
          };
        };
      };
    };
  };
  /** Updates many documents in database */
  updateManyDocuments: {
    parameters: {
      path: {
        /** @description The document collection name */
        coll: string;
      };
    };
    /** @description The query to find documents */
    requestBody: {
      content: {
        "application/json": {
          filter: components["schemas"]["data.query"];
          update: components["schemas"]["data.update"];
        };
      };
    };
    responses: {
      /** @description Documents updated */
      200: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  /** Creates a transaction */
  createTransaction: {
    responses: {
      /** @description Transaction created */
      200: {
        content: {
          "application/json": string;
        };
      };
    };
  };
  /** Commits a transaction */
  commitTransaction: {
    responses: {
      /** @description Transaction commited */
      200: {
        content: never;
      };
    };
  };
  /** Aborts a transaction */
  abortTransaction: {
    responses: {
      /** @description Transaction aborted */
      200: {
        content: never;
      };
    };
  };
}
