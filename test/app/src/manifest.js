import { View } from "@lenra/app";

/**
 * @type {import("../../../dist/lib/gen/manifest.js").Exposer}
 */
export const lenra = {
    routes: [
        {
            path: "/",
            view: View("main"),
        }
    ]
};