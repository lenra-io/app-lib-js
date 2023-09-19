import { Text, View } from "@lenra/app";

export default function () {
    return View("main::test");
}

export function test() {
    return Text("Hello world");
}

export function test2() {
    return Text("Never used");
}