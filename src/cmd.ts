import { Dispatcher } from './dispatch';

export type Cmd<Msg> = (dispatch: Dispatcher<Msg>) => void;

export function isCmdDispatch<Model, Msg>(v: any): v is [Model, Cmd<Msg>] {
    return Array.isArray(v) && v.length === 2 && typeof v[1] === 'function';
}
