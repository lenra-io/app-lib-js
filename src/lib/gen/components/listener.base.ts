// This file is auto-generated by generate-classes.js but it can be edited

import { Listener as IListener } from "../response.js";
import { ListenerName } from "../names.js";
import { Component } from "../../components/component.js";

export { IListener }

export class ListenerBaseImpl extends Component<IListener> {
    props(props: IListener['props']) {
        this.model.props = props;
        return this;
    }
}