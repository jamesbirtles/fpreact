import { h, render, component, Message } from '..';

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

    update(model, msg) {
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
