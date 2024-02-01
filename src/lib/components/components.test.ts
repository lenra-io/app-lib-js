import * as components from "./index";
import * as path from "path";
import * as fs from "fs";

const schemaPath = path.resolve("api", "responses/view.schema.json");

test("lenra-components API loaded", () => {
  expect(fs.existsSync(schemaPath)).toBe(true);
});

describe("Managed component", () => {
  const componentsSchema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
  const mainSchema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
  const componentList = [
    ...mainSchema.definitions["components.lenra"].oneOf,
    ...mainSchema.definitions["components.json"].oneOf,
  ].map(c => c.$ref);

  describe.each(componentList)("%s", (ref) => {
    // Check if the class exists
    const content = ref.replace(/^#\/?/, "").split("/").reduce((o, part) => o[part], componentsSchema);
    const f = components[content.title];
    const c = components[`${content.title}Impl`];
    test(`function ${content.title} exists`, () => {
      expect(f).toBeDefined();
    });
    test(`class ${content.title}Impl exists`, () => {
      expect(c).toBeDefined();
    });

    if (c) {
      describe("methods", () => {
        const properties = Object.entries(content.properties).filter(
          ([key, _]) => !(content.required || []).includes(key)
        );

        if (properties.length > 0) {
          test.each(properties)(`%s exists`, (key, descriptor) => {
            expect(c.prototype[key]).toBeDefined();
          });
        }
      });
    }
  });
});
