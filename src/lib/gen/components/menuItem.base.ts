// This file is auto-generated by generate-classes.js but it can be edited

import { MenuItem as IMenuItem } from "../response.js";
import { ListenerName } from "../names.js";
import { Component } from "../../components/component.js";

export { IMenuItem }

export class MenuItemBaseImpl extends Component<IMenuItem> {
    /**
     * Whether the element is selected or not.
     */
    isSelected(isSelected: IMenuItem['isSelected']) {
        this.model.isSelected = isSelected;
        return this;
    }
    /**
     * Whether the element should be disabled or not.
     */
    disabled(disabled: IMenuItem['disabled']) {
        this.model.disabled = disabled;
        return this;
    }
    icon(icon: IMenuItem['icon']) {
        this.model.icon = icon;
        return this;
    }
    onPressed(listener: ListenerName, props?: { [k: string]: unknown; }) { return this.setListener("onPressed", listener, props); }
}
