import { test } from "@jest/globals";
import { Stack } from "./stack.js";
import { checkComponent } from "./component.test.lib.js";
import { Button } from "./button.js";

test("empty", () => {
  checkComponent(Stack(), {
    _type: "stack",
    children: [],
  });
});

test("children", () => {
  checkComponent(Stack([Button("Test").onPressed("test")]), {
    _type: "stack",
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
