// This file is auto-generated by generate-classes.js but it can be edited

import { View as IView } from "../response.js";
import { ListenerName } from "../names.js";
import { Component } from "../../components/component.js";

export { IView }

export class ViewBaseImpl extends Component<IView> {
    props(props: IView['props']) {
        this.model.props = props;
        return this;
    }
    find(find: IView['find']) {
        this.model.find = find;
        return this;
    }
    /**
     * The context projection. This field represents the projection of the context, allowing selective retrieval of specific elements. It is a map that specifies the desired elements to be included in the projection.
     */
    context(context: IView['context']) {
        this.model.context = context;
        return this;
    }
}
