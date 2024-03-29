import { test } from "@jest/globals";
import { Button } from "./button";
import { checkComponent } from "./component.test.lib";

test("basic", () => {
  checkComponent(Button("My text"), {
    _type: "button",
    text: "My text",
  });
});

test("onPressed", () => {
  checkComponent(Button("My text").onPressed("test"), {
    _type: "button",
    text: "My text",
    onPressed: {
      _type: "listener",
      name: "test",
    },
  });
});
