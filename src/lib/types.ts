import { Api } from "./Api";
import { Component, IComponent } from "./components/component";
import { ListenerRequest, ViewRequest } from "./gen/request";

export type View = (data: ViewRequest['data'], props: ViewRequest['props'], context: ViewRequest['context']) => Component<IComponent> | IComponent;

export type Listener = (props: ListenerRequest['props'], event: ListenerRequest['props'], api: Api) => any;

export type ViewGetter = (view: string) => Promise<View>;
export type ListenerGetter = (listener: string) => Promise<Listener>;
