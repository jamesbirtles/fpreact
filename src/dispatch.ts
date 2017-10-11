import { Result } from './result';

export type Dispatcher<Msg> = (action: Msg) => (value?: any) => any;

export interface DispatchResult<Msg> {
    kind: Msg;
    result: Result;
}
