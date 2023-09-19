// This file is auto-generated by generate-classes.js but it can be edited

import { Stack as IStack } from "../response.js";
import { ListenerName } from "../names.js";
import { Component } from "../../components/component.js";

export { IStack }

export class StackBaseImpl extends Component<IStack> {
    alignment(alignment: IStack['alignment']) {
        this.model.alignment = alignment;
        return this;
    }
    fit(fit: IStack['fit']) {
        this.model.fit = fit;
        return this;
    }
}
