// This file is auto-generated by generate-classes.js. Do not edit it.

import { ITextField, TextFieldBaseImpl } from "../gen/components/textfield.base.js";

export { ITextField };

export function TextField(value: ITextField['value']): TextFieldImpl {
  return new TextFieldImpl({
    _type: "textfield",
    value: value,
  });
}

export class TextFieldImpl extends TextFieldBaseImpl {
  // Add here custom implementations
}
