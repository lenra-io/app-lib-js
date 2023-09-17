// This file is auto-generated by generate-classes.js but it can be edited

import { Checkbox as ICheckbox } from "../response";
import { Component } from "../../components/component";

export { ICheckbox }

export class CheckboxBaseImpl extends Component<ICheckbox> {
    /**
     * Whether the checkbox can have 3 states.
     */
    tristate(tristate: ICheckbox['tristate']) {
        this.model.tristate = tristate;
        return this;
    }
    onPressed(action: string, props?: { [k: string]: unknown; }) { return this.setListener("onPressed", action, props); }
    style(style: ICheckbox['style']) {
        this.model.style = style;
        return this;
    }
    materialTapTargetSize(materialTapTargetSize: ICheckbox['materialTapTargetSize']) {
        this.model.materialTapTargetSize = materialTapTargetSize;
        return this;
    }
    /**
     * Whether the checkbox is focused initially.
     */
    autofocus(autofocus: ICheckbox['autofocus']) {
        this.model.autofocus = autofocus;
        return this;
    }
    /**
     * The name that will be used in the form.
     */
    name(name: ICheckbox['name']) {
        this.model.name = name;
        return this;
    }
}
