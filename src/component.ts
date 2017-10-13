import { Component, ComponentConstructor } from 'preact';
import { Dispatcher } from './dispatcher';
import { Cmd, isCmdDispatch } from './cmd';

export interface Message<K, V = any, E extends Error = any> {
    kind: K;
    value: V;
    error: E;
}

export interface ComponentDefinition<Model, Msg extends Message<any>, Props> {
    model: Model;
    update(model: Model, msg: Msg): Model | [Model, Cmd<Msg['kind']>];
    view(model: Model, dispatch: Dispatcher<Msg['kind']>): JSX.Element | null;

    init?(model: Model, dispatch: Dispatcher<Msg['kind']>): void;
    props?(props: Props, dispatch: Dispatcher<Msg['kind']>): void;
}

export function component<Model, Msg extends Message<any>, Props = {}>(
    comp: ComponentDefinition<Model, Msg, Props>,
): ComponentConstructor<Props, Model> {
    return class extends Component<Props, Model> {
        dispatchers = new Map<Msg['kind'], (value?: any, err?: Error) => void>();
        state = comp.model;

        componentWillMount() {
            if (comp.props != null) {
                comp.props(this.props, this.dispatch);
            }
        }

        componentDidMount() {
            if (comp.init != null) {
                comp.init(this.state, this.dispatch);
            }
        }

        componentWillReceiveProps(props: Props) {
            // TODO: only if changed?
            if (comp.props != null) {
                comp.props(props, this.dispatch);
            }
        }

        dispatch = (kind: Msg['kind']) => {
            let dispatcher = this.dispatchers.get(kind);
            if (dispatcher == null) {
                dispatcher = (value: any, err: Error) => {
                    let msg = { kind, value, error: err };
                    if (value instanceof Event && value.target instanceof HTMLInputElement) {
                        switch (value.target.type) {
                            case 'checkbox':
                                msg = { ...msg, value: value.target.checked };
                                break;
                            default:
                                msg = { ...msg, value: value.target.value };
                                break;
                        }
                    }

                    const res = comp.update(this.state, <any>msg);
                    let model: Model;
                    if (isCmdDispatch<Model, Msg['kind']>(res)) {
                        model = res[0];
                        res[1](this.dispatch);
                    } else {
                        model = res;
                    }

                    this.setState(model);
                };
                this.dispatchers.set(kind, dispatcher);
            }

            return dispatcher;
        };

        render() {
            return comp.view(this.state, this.dispatch);
        }
    };
}
