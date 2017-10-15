import { Component } from 'preact';

function upperFirst(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function trigger(evt: string, ...args: any[]) {
    return function(this: Component<any, any>) {
        const eventHandler = this.props[`on${upperFirst(evt)}`];

        if (eventHandler != null) {
            eventHandler(...args);
        }
    };
}
