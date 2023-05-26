import { Text, View } from "@lenra/components";
import { views } from "../../index.gen.js";

export default function () {
    return View(views.main.test);
}

export function test() {
    return Text("Hello world");
}

export function test2() {
    return Text("Never used");
}