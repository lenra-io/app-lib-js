// This file is auto-generated by generate-classes.js. Do not edit it.

import { ICarousel, CarouselBaseImpl } from "../gen/components/carousel.base.js";

export { ICarousel };

export function Carousel(children: ICarousel['children']): CarouselImpl {
  return new CarouselImpl({
    _type: "carousel",
    children: children,
  });
}

export class CarouselImpl extends CarouselBaseImpl {
  // Add here custom implementations
}