// This file is auto-generated by generate-classes.js. Do not edit it.

import { Query } from "../gen/response.js";
import { IView, ViewBaseImpl } from "../gen/components/view.base.js";
import { ViewName } from "../gen/names.js";
import { Data } from "../Data.js";
import { Class, DataApi } from "../Api.js";

export { IView };

export function View(name: ViewName): ViewImpl {
  return new ViewImpl({
    _type: "view",
    name: name,
  });
}

interface IFind {
  coll: string,
  query: Query,
  projection? : { [k: string]: unknown },
  limit: number,
  skip: number,
}

export class ViewImpl extends ViewBaseImpl {
  // Add here custom implementations
  find<T extends Data>(coll: Class<T>, query: Query, projection?: { [k: string]: unknown }): this
  find({coll, query, projection, limit, skip}: IFind): this
  find(find: IView['find']): this
  find(param1: string | Class<Data> | IView['find'], query?: Query, projection?: { [k: string]: unknown }): this {
    if (typeof param1 === "function") {
      param1 = DataApi.collectionName(<Class<Data>>param1);
    }
    if (typeof param1 === "string") { // param 1 is now guaranteed to be string
      query = query!;
      const find: IView['find'] = { coll: param1, query };
      if (projection) {
        find.projection = projection;
      }
      return super.find(find);
    }
    return super.find(<IView['find']>param1);
  }
}
