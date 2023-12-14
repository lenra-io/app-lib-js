import fs from "fs";
import path from "path";

const apis = [
    "internal-api.yml",
    "requests/app.schema.json",
    "responses/view.schema.json",
    "manifest.schema.json",
];

const apiDir = "api";

loadApis();

async function loadApis() {
    const apiVersion = fs.readFileSync("api-version.txt", "utf-8").trim();
    if (!fs.existsSync(apiDir)) {
        fs.mkdirSync(apiDir);
    }
    else {
        const loadedApiVersion = fs.readFileSync(path.join(apiDir, "api-version.txt"), "utf-8").trim();
        if (loadedApiVersion === apiVersion) return;
        console.log(`Removing old api`);
        fs.readdirSync(apiDir).forEach(file => {
            fs.rmSync(path.join(apiDir, file));
        });
    }
    fs.writeFileSync(path.join(apiDir, "api-version.txt"), apiVersion, "utf-8");
    apis.forEach(async (api) => {
        const apiPath = path.resolve(apiDir, api);
        console.log(`Loading ${apiPath} file`);
        // TODO: The release files are not here anymore, they are in a tar.gz file
        const response = await fetch(`https://github.com/lenra-io/api/releases/download/v${apiVersion}/${api}`);
        fs.writeFileSync(apiPath, await response.text(), "utf-8");
    });
}