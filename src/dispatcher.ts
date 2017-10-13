export type Dispatcher<K> = (kind: K) => (value?: any, err?: Error) => void;
