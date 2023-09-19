// This file is auto-generated by generate-classes.js but it can be edited

import { Button as IButton } from "../response.js";
import { ListenerName } from "../names.js";
import { Component } from "../../components/component.js";

export { IButton }

export class ButtonBaseImpl extends Component<IButton> {
    /**
     * The button is disabled if true
     */
    disabled(disabled: IButton['disabled']) {
        this.model.disabled = disabled;
        return this;
    }
    size(size: IButton['size']) {
        this.model.size = size;
        return this;
    }
    mainStyle(mainStyle: IButton['mainStyle']) {
        this.model.mainStyle = mainStyle;
        return this;
    }
    onPressed(listener: ListenerName, props?: { [k: string]: unknown; }) { return this.setListener("onPressed", listener, props); }
    leftIcon(leftIcon: IButton['leftIcon']) {
        this.model.leftIcon = leftIcon;
        return this;
    }
    rightIcon(rightIcon: IButton['rightIcon']) {
        this.model.rightIcon = rightIcon;
        return this;
    }
    /**
     * Whether the button is a submit button for a form.
     */
    submit(submit: IButton['submit']) {
        this.model.submit = submit;
        return this;
    }
}
