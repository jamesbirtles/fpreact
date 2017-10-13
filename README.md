# fpreact (Functional Preact)
fpreact provides an alternative api for creating preact components, heavily inspired by elm. The api includes redux style state management and lends itself to functional programming, avoiding the use of `this`

It has first class TypeScript support (it's written in it!), but also works great with regular JavaScript.

## Install
```
npm i -S fpreact preact
```

## Example
Find more in the `examples` folder.

### TypeScript
```tsx
import { h, render, component, Message } from 'fpreact';

enum Msg {
    UpdateName,
}

interface Model {
    name: string;
}

type Messages = Message<Msg.UpdateName, string>;

const Greet = component<Model, Messages>({
    model: {
        name: 'world',
    },

    update(msg, model) {
        switch (msg.kind) {
            case Msg.UpdateName:
                return { ...model, name: msg.value };
        }

        return model;
    },

    view(model, dispatch) {
        return (
            <div>
                <h1>Hello, {model.name}</h1>
                <label>
                    <span>Name:</span>
                    <input value={model.name} onInput={dispatch(Msg.UpdateName)} />
                </label>
            </div>
        );
    },
});

render(<Greet />, document.body);
```

### JavaScript (ES6 + JSX)
```jsx
import { h, render, component } from 'fpreact';

const Msg = {
    // You don't have to use a number here.
    // You could just as easily use "UPDATE_NAME" or anything else if you desire,
    // just make sure each item has a unique value
    UpdateName: 0,
};

const Greet = component({
    model: {
        name: 'world',
    },

    update(msg, model) {
        switch (msg.kind) {
            case Msg.UpdateName:
                return { ...model, name: msg.value };
        }

        return model;
    },

    view(model, dispatch) {
        return (
            <div>
                <h1>Hello, {model.name}</h1>
                <label>
                    <span>Name:</span>
                    <input value={model.name} onInput={dispatch(Msg.UpdateName)} />
                </label>
            </div>
        );
    },
});

render(<Greet />, document.body);
```

### JavaScript (ES5)
```js
'use strict';

var fpreact = require('fpreact');

var Msg = {
    UpdateName: 0,
};

var Greet = fpreact.component({
    model: {
        name: 'world',
    },

    update: function(msg, model) {
        switch (msg.kind) {
            case Msg.UpdateName:
                return Object.assign({}, model, { name: msg.value });
        }

        return model;
    },

    view: function(model, dispatch) {
        return fpreact.h(
            'div',
            null,
            fpreact.h('h1', null, 'Hello, ', model.name),
            fpreact.h(
                'label',
                null,
                fpreact.h('span', null, 'Name:'),
                fpreact.h('input', { value: model.name, onInput: dispatch(Msg.UpdateName) }),
            ),
        );
    },
});

fpreact.render(fpreact.h(Greet, null), document.body);
```
