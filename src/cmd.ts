import { Dispatcher } from './dispatcher';

export type Cmd<K> = (dispatch: Dispatcher<K>) => void;

export function isCmdDispatch<Model, K>(v: any): v is [Model, Cmd<K>] {
    return Array.isArray(v) && v.length === 2 && typeof v[1] === 'function';
}
