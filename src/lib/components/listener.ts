// This file is auto-generated by generate-classes.js. Do not edit it.

import { IListener, ListenerBaseImpl } from "../gen/components/listener.base.js";

export { IListener };

export function Listener(name: IListener['name']): ListenerImpl {
  return new ListenerImpl({
    _type: "listener",
    name: name,
  });
}

export class ListenerImpl extends ListenerBaseImpl {
  // Add here custom implementations
}
