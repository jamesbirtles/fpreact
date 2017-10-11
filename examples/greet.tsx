import { h, render, component } from '..';

enum Msg {
    UpdateName,
}

interface Model {
    name: string;
}

const Greet = component<Model, Msg>({
    model: {
        name: 'world',
    },

    update(msg, model) {
        switch (msg.kind) {
            case Msg.UpdateName:
                return { ...model, name: msg.result.get() };
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
