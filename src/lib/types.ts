import { Api } from "./Api.js";
import { Component, IComponent } from "./components/component.js";
import { AppRequest, ListenerRequest, ViewRequest } from "./gen/request.js";
import { Handler } from "./handler.js";

export abstract class App {
    constructor(protected readonly handler: Handler) { }
    abstract start(request?: AppRequest): void;
}

export type ViewHandler = (data: ViewRequest['data'], props: ViewRequest['props'], context: ViewRequest['context']) => Component<IComponent> | IComponent;

export type ListenerHandler = (props: ListenerRequest['props'], event: ListenerRequest['props'], api: Api) => any;

export type ViewGetter = (view: string) => Promise<ViewHandler>;
export type ListenerGetter = (listener: string) => Promise<ListenerHandler>;
