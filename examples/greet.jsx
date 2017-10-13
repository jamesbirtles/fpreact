import { h, render, component } from '..';

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
