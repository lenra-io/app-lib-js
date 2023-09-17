// This file is auto-generated by generate-classes.js but it can be edited

import { Flexible as IFlexible } from "../response";
import { Component } from "../../components/component";

export { IFlexible }

export class FlexibleBaseImpl extends Component<IFlexible> {
    /**
     * How a flexible child is inscribed into the available space.
     */
    flex(flex: IFlexible['flex']) {
        this.model.flex = flex;
        return this;
    }
    fit(fit: IFlexible['fit']) {
        this.model.fit = fit;
        return this;
    }
}
