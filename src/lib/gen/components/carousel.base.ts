// This file is auto-generated by generate-classes.js but it can be edited

import { Carousel as ICarousel } from "../response.js";
import { ListenerName } from "../names.js";
import { Component } from "../../components/component.js";

export { ICarousel }

export class CarouselBaseImpl extends Component<ICarousel> {
    options(options: ICarousel['options']) {
        this.model.options = options;
        return this;
    }
}
