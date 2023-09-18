import { View } from "@lenra/app";

/**
 * @type {import("@lenra/app").Manifest}
 */
export default {
    lenra: {
        routes: [
            {
                path: "/",
                view: View("main"),
            }
        ]
    }
};