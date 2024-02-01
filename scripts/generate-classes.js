import fs from "fs";
import path from "path";

const libDir = path.resolve("src", "lib");
const baseComponentsDir = path.resolve(libDir, "gen", "components");
const componentsImplDir = path.resolve(libDir, "components");
const componentsFile = path.resolve(componentsImplDir, "index.ts");

generateClasses();

async function generateClasses() {
  const schemaPath = path.resolve("api", "responses/view.schema.json");
  const mainSchema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
  const componentList = [
    ...mainSchema.definitions["components.lenra"].oneOf,
    ...mainSchema.definitions["components.json"].oneOf,
  ].map(c => c.$ref);
  // Generate not existing classes
  let componentsExports = fs.existsSync(componentsFile) ? fs.readFileSync(componentsFile, "utf-8").split("\n").filter(line => !line.startsWith("//")) : ["export * from './component.js';"];
  let componentsFileChanged = false;

  for (const ref of componentList) {
    const comp = ref.split("/").pop().split(".").pop();
    // Check if the class exists
    const schema = ref.replace(/^#\/?/, "").split("/").reduce((o, part) => o[part], mainSchema);
    const baseClassPath = path.join(baseComponentsDir, `${comp}.base.ts`);
    console.log(`Generating ${baseClassPath} file for ${schema.title}`);
    fs.mkdirSync(path.dirname(baseClassPath), {
      recursive: true,
    });
    fs.writeFileSync(baseClassPath, generateBaseClass(schema));

    // Check if the file corresponding to the schema exists
    const classPath = path.join(componentsImplDir, `${comp}.ts`);

    if (!fs.existsSync(classPath)) {
      // Creates the file
      console.log(`Generating ${classPath} file for ${schema.title}`);
      fs.writeFileSync(classPath, generateImplClass(schema, `${comp}.base`));
    }
    // Check if the file is imported in the main components file
    const importComponent = `export * from './${comp}.js';`;
    if (!componentsExports.includes(importComponent)) {
      console.log(`Adding import for ${classPath}`);
      componentsExports.push(importComponent);
      componentsFileChanged = true;
    }
  }
  if (componentsFileChanged) {
    console.log(`Updating ${componentsFile}`);
    componentsExports.sort();
    componentsExports.unshift("// This file is auto-generated by generate-classes.js. Do not edit it.");
    fs.writeFileSync(componentsFile, componentsExports.join("\n"), "utf-8");
  }
}

function generateImplClass(schema, from) {
  const { title, properties, required } = schema;
  const requiredNoType = required.filter((key) => key != "_type");

  return `// This file is auto-generated by generate-classes.js. Do not edit it.

import { I${title}, ${title}BaseImpl } from "../gen/components/${from}.js";

export { I${title} };

export function ${title}(${requiredNoType.map(key => `${key}: I${title}['${key}']`).join(", ")}): ${title}Impl {
  return new ${title}Impl({
    _type: "${properties._type.const}",
    ${requiredNoType
      .map((key) => `${key}: ${key},`)
      .join("\n    ")}
  });
}

export class ${title}Impl extends ${title}BaseImpl {
  // Add here custom implementations
}
`;
}

function generateBaseClass(schema) {
  const { title, properties, required } = schema;
  const propertiesNotRequired = (properties ? Object.entries(properties) : []).map(([key, _]) => key)
    .filter(key => !(required || []).includes(key));

  return `// This file is auto-generated by generate-classes.js but it can be edited

import { ${title} as I${title} } from "../response.js";
import { ListenerName } from "../names.js";
import { Component } from "../../components/component.js";

export { I${title} }

export class ${title}BaseImpl extends Component<I${title}> {
    ${propertiesNotRequired
      .map(key => {
        const jsdocLines = [];
        const property = properties[key];
        let jsdoc = '';
        if (property.description) jsdocLines.push(property.description);
        if (property.deprecated) jsdocLines.push(`@deprecated ${property.deprecatedComment ?? ""}`);
        if (jsdocLines.length > 0) {
          jsdoc = `/**
${jsdocLines
              .flatMap(line => line.split('\n'))
              .map(line => `     * ${line}`).join('\n')}
     */
    `;
        }
        if (/^on[A-Z]/.test(key)) {
          return `${jsdoc}${key}(listener: ListenerName, props?: { [k: string]: unknown; }) { return this.setListener("${key}", listener, props); }`;
        }
        return `${jsdoc}${key}(${key}: I${title}['${key}']) {
        this.model.${key} = ${key};
        return this;
    }`;
      })
      .join("\n    ")}
}
`;
}
