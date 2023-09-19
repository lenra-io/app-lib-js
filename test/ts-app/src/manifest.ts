import { Manifest, View } from "@lenra/app";

/**
 * @type {Manifest}
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