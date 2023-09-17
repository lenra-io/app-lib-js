// This file is auto-generated by generate-classes.js but it can be edited

import { Form as IForm } from "../response.js";
import { Component } from "../../components/component.js";

export { IForm }

export class FormBaseImpl extends Component<IForm> {
    /**
     * Callback when the user submits the form.
     */
    onSubmit(action: string, props?: { [k: string]: unknown; }) { return this.setListener("onSubmit", action, props); }
}