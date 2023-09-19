import { test } from "@jest/globals";
import { View } from "./view";
import { checkComponent } from "./component.test.lib";
import { Data } from "../Data.js";
import { DataApi } from "../Api.js";

class TestData extends Data {
  constructor(public name: string) {
    super();
  }
}

test("basic", () => {
  checkComponent(View("test"), {
    _type: "view",
    name: "test",
  });
});

describe("find", () => {
  test("by string", () => {
    checkComponent(View("test").find("coll", { name: "my name" }), {
      "_type": "view",
      "name": "test",
      "find": {
        "coll": "coll",
        "query": {
          "name": "my name"
        }
      }
    });
  });

  test("by class with DataApi.collectionName", () => {
    checkComponent(View("test").find(DataApi.collectionName(TestData), { name: "my name" }), {
      "_type": "view",
      "name": "test",
      "find": {
        "coll": "testdata",
        "query": {
          "name": "my name"
        }
      }
    });
  });

  test("by class", () => {
    checkComponent(View("test").find(TestData, { name: "my name" }), {
      "_type": "view",
      "name": "test",
      "find": {
        "coll": "testdata",
        "query": {
          "name": "my name"
        }
      }
    });
  });
});
