import { compile } from "json-schema-to-typescript";
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);


const schemaPath = path.resolve("api", args[0]);
const tsPath = path.resolve("src/lib/gen", args[1]);

generatesInterface();

// Generate interfaces
async function generatesInterface() {
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
  const ts = await compile(schema);
  fs.mkdirSync(path.dirname(tsPath), {
    recursive: true,
  });
  fs.writeFileSync(tsPath, ts);
}
