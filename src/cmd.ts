import { Dispatcher } from './dispatcher';
import { Component } from 'preact';

export type Cmd<K> = (this: Component<any, any>, dispatch: Dispatcher<K>) => void;

export function isCmdDispatch<Model, K>(v: any): v is [Model, Cmd<K>] {
    return Array.isArray(v) && v.length === 2 && typeof v[1] === 'function';
}
