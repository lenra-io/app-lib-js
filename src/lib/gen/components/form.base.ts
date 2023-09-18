// This file is auto-generated by generate-classes.js but it can be edited

import { Form as IForm } from "../response";
import { ListenerName } from "../names";
import { Component } from "../../components/component";

export { IForm }

export class FormBaseImpl extends Component<IForm> {
    /**
     * Callback when the user submits the form.
     */
    onSubmit(listener: ListenerName, props?: { [k: string]: unknown; }) { return this.setListener("onSubmit", listener, props); }
}
