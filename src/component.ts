import { Component, ComponentConstructor } from 'preact';

import { DispatchResult, Dispatcher } from './dispatch';
import { Result, r } from './result';
import { Cmd, isCmdDispatch } from './cmd';

export interface ComponentDefinition<Model, Msg, Props> {
    model: Model;
    update(msg: DispatchResult<Msg>, model: Model): Model | [Model, Cmd<Msg>];
    view(model: Model, dispatch: Dispatcher<Msg>): JSX.Element | null;

    init?(model: Model, dispatch: Dispatcher<Msg>): void;
    props?(props: Props, dispatch: Dispatcher<Msg>): void;
}

export function component<Model, Msg, Props = {}>(
    comp: ComponentDefinition<Model, Msg, Props>,
): ComponentConstructor<Props, Model> {
    return class extends Component<Props, Model> {
        dispatchers = new Map<Msg, (value?: any) => any>();
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

        dispatch = (msg: Msg) => {
            let dispatcher = this.dispatchers.get(msg);
            if (dispatcher == null) {
                dispatcher = (value: any) => {
                    let result: Result;
                    if (value instanceof Result) {
                        result = value;
                    } else if (value instanceof Event && value.target instanceof HTMLInputElement) {
                        switch (value.target.type) {
                            case 'checkbox':
                                result = r(value.target.checked);
                                break;
                            default:
                                result = r(value.target.value);
                                break;
                        }
                    } else {
                        result = r(value);
                    }

                    const res = comp.update({ kind: msg, result }, this.state);
                    let model: Model;
                    if (isCmdDispatch(res)) {
                        model = res[0];
                        res[1](this.dispatch);
                    } else {
                        model = res;
                    }

                    this.setState(model);
                };
                this.dispatchers.set(msg, dispatcher);
            }

            return dispatcher;
        };

        render() {
            return comp.view(this.state, this.dispatch);
        }
    };
}
