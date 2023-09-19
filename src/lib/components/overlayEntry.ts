// This file is auto-generated by generate-classes.js. Do not edit it.

import { LenraComponent } from '../gen/response.js';
import { Component } from './component.js';
import { IOverlayEntry, OverlayEntryBaseImpl } from "../gen/components/overlayEntry.base.js";

export { IOverlayEntry };

export function OverlayEntry<T extends LenraComponent>(child: Component<T> | T): OverlayEntryImpl {
  return new OverlayEntryImpl({
      _type: "overlayEntry",
      child: Component.normalize(child),
  });
}

export class OverlayEntryImpl extends OverlayEntryBaseImpl {
  // Add here custom implementations
}