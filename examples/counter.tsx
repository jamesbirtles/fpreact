import { h, render, component, Dispatcher, Message } from '..';

enum Msg {
    Increment,
    Decrement,
    SetCounter,
    StartInterval,
    StopInterval,
    TrackInterval,
    Reset,
}

type Messages =
    | Message<Msg.Increment>
    | Message<Msg.Decrement>
    | Message<Msg.SetCounter, number>
    | Message<Msg.StartInterval>
    | Message<Msg.StopInterval>
    | Message<Msg.TrackInterval, number>
    | Message<Msg.Reset>;

interface Model {
    counter: number;
    interval?: number;
}

function startInterval(dispatch: Dispatcher<Msg>) {
    dispatch(Msg.TrackInterval)(setInterval(dispatch(Msg.Increment), 1000));
}

function stopInterval(interval: number) {
    return (dispatch: Dispatcher<Msg>) => {
        clearInterval(interval);
        dispatch(Msg.TrackInterval)(null);
    };
}

const Counter = component<Model, Messages, { value: number }>({
    model: {
        counter: 0,
    },

    props(props, dispatch) {
        dispatch(Msg.SetCounter)(props.value);
    },

    update(model, msg) {
        switch (msg.kind) {
            case Msg.Increment:
                return { ...model, counter: model.counter + 1 };
            case Msg.Decrement:
                return { ...model, counter: model.counter - 1 };
            case Msg.SetCounter:
                return { ...model, counter: msg.value };
            case Msg.Reset:
                return { ...model, counter: 0 };
            case Msg.StartInterval:
                if (model.interval != null) {
                    return model;
                }

                return [model, startInterval];
            case Msg.StopInterval:
                if (model.interval == null) {
                    return model;
                }

                return [model, stopInterval(model.interval)];
            case Msg.TrackInterval:
                return { ...model, interval: msg.value };
        }

        return model;
    },

    view(model, dispatch) {
        return (
            <div>
                <span>{model.counter}</span>
                <button onClick={dispatch(Msg.Increment)}>+</button>
                <button onClick={dispatch(Msg.Decrement)}>-</button>
                <button onClick={dispatch(Msg.Reset)}>Reset</button>
                <button onClick={dispatch(Msg.StartInterval)} disabled={model.interval != null}>
                    Start
                </button>
                <button onClick={dispatch(Msg.StopInterval)} disabled={model.interval == null}>
                    Stop
                </button>
            </div>
        );
    },
});

render(<Counter value={50} />, document.body);
