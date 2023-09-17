// This file is auto-generated by generate-classes.js but it can be edited

import { Text as IText } from "../response";
import { Component } from "../../components/component";

export { IText }

export class TextBaseImpl extends Component<IText> {
    style(style: IText['style']) {
        this.model.style = style;
        return this;
    }
    locale(locale: IText['locale']) {
        this.model.locale = locale;
        return this;
    }
    /**
     * The value to explain a different semantics
     */
    semanticsLabel(semanticsLabel: IText['semanticsLabel']) {
        this.model.semanticsLabel = semanticsLabel;
        return this;
    }
    /**
     * Whether the assistive technologies should spell out this text character by character
     */
    spellOut(spellOut: IText['spellOut']) {
        this.model.spellOut = spellOut;
        return this;
    }
    /**
     * The text alignment
     */
    textAlign(textAlign: IText['textAlign']) {
        this.model.textAlign = textAlign;
        return this;
    }
    /**
     * Additional texts to add after this text.
     */
    children(children: IText['children']) {
        this.model.children = children;
        return this;
    }
}
