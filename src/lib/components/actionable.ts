// This file is auto-generated by generate-classes.js. Do not edit it.

import { IActionable, ActionableBaseImpl } from "../gen/components/actionable.base.js";

export { IActionable };

export function Actionable(child: IActionable['child']): ActionableImpl {
  return new ActionableImpl({
    _type: "actionable",
    child: child,
  });
}

export class ActionableImpl extends ActionableBaseImpl {
  // Add here custom implementations
}