import { Component, ComponentConstructor } from 'preact';
import { Dispatcher } from './dispatcher';
import { Cmd, isCmdDispatch } from './cmd';

export interface Message<K, V = any, E extends Error = any> {
    kind: K;
    value: V;
    error: E;
}

export interface ComponentDefinition<Model, Msg extends Message<any>, Props> {
    update(model: Model | undefined, msg: Msg): Model | [Model, Cmd<Msg['kind']>];
    view(model: Model, dispatch: Dispatcher<Msg['kind']>): JSX.Element | null;

    init?(model: Model, dispatch: Dispatcher<Msg['kind']>): void;
    props?(props: Props, dispatch: Dispatcher<Msg['kind']>): void;
}

const noop = () => null;

function runUpdate<Model, Msg extends Message<any>>(
    comp: ComponentDefinition<Model, Msg, any>,
    model: Model,
    msg: Msg,
): { model: Model; cmd: Cmd<Msg['kind']> } {
    const res = comp.update(model, <any>msg);
    let newModel: Model;
    let cmd: Cmd<Msg['kind']> = noop;
    if (isCmdDispatch<Model, Msg['kind']>(res)) {
        newModel = res[0];
        cmd = res[1];
    } else {
        newModel = res;
    }

    return { model: newModel, cmd };
}

export function component<Model, Msg extends Message<any>, Props = {}>(
    comp: ComponentDefinition<Model, Msg, Props>,
): ComponentConstructor<Props, Model> {
    return class extends Component<Props, Model> {
        dispatchers = new Map<Msg['kind'], (value?: any, err?: Error) => void>();

        constructor(...args: any[]) {
            super(...args);

            const update = runUpdate(comp, undefined, {
                kind: -1,
                value: undefined,
                error: undefined,
            } as any);

            // Clone the initial state onto the state object
            // to avoid preact from mutating the initial state
            // on later calls to setState
            this.state = { ...(update.model as any) };
            update.cmd.call(this, this.dispatch);
        }

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

                    const update = runUpdate(comp, this.state, msg as any);
                    this.replaceState(update.model);
                    update.cmd.call(this, this.dispatch);
                };
                this.dispatchers.set(kind, dispatcher);
            }

            return dispatcher;
        };

        // Copied from preact-compat
        replaceState(state: Model, callback?: () => void) {
            this.setState(state, callback);
            for (let i in this.state) {
                if (!(i in state)) {
                    delete this.state[i];
                }
            }
        }

        render() {
            return comp.view(this.state, this.dispatch);
        }
    };
}
