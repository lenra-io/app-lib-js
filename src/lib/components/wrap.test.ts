import { test } from "@jest/globals";
import { Wrap } from "./wrap.js";
import { checkComponent } from "./component.test.lib.js";
import { Button } from "./button.js";

test("empty", () => {
  checkComponent(Wrap(), {
    _type: "wrap",
    children: [],
  });
});

test("children", () => {
  checkComponent(Wrap([Button("Test").onPressed("test")]), {
    _type: "wrap",
    children: [
      {
        _type: "button",
        text: "Test",
        onPressed: {
          _type: "listener",
          name: "test",
        },
      },
    ],
  });
});
