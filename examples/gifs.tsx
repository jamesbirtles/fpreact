import { h, component, render, Dispatcher, Message } from '..';

enum Msg {
    MorePlease,
    NewGif,
    UpdateTopic,
}

interface Model {
    topic: string;
    gifUrl: string;
    error: string;
}

type Messages =
    | Message<Msg.MorePlease>
    | Message<Msg.NewGif, string, Error>
    | Message<Msg.UpdateTopic, string>;

function getRandomGif(topic: string) {
    return (dispatch: Dispatcher<Msg>) => {
        fetch('https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=' + topic)
            .then(res => {
                if (res.status !== 200) {
                    throw new Error(`Unexpected response from server: ${res.status}`);
                }

                return res.json();
            })
            .then(res => dispatch(Msg.NewGif)(res.data.image_url))
            .catch(err => dispatch(Msg.NewGif)(null, err));
    };
}

const RandomGifs = component<Model, Messages>({
    model: {
        topic: 'cats',
        gifUrl: '',
        error: '',
    },

    init(model, dispatch) {
        dispatch(Msg.MorePlease)();
    },

    update(model, msg) {
        switch (msg.kind) {
            case Msg.MorePlease:
                return [model, getRandomGif(model.topic)];
            case Msg.NewGif:
                if (msg.error) {
                    return { ...model, error: msg.error.message };
                }

                return { ...model, gifUrl: msg.value, error: '' };
            case Msg.UpdateTopic:
                return { ...model, topic: msg.value };
        }

        return model;
    },

    view(model, dispatch) {
        return (
            <div>
                <h2>{model.topic}</h2>
                <input value={model.topic} onInput={dispatch(Msg.UpdateTopic)} />
                <button onClick={dispatch(Msg.MorePlease)}>More Please!</button>
                <br />
                {model.error && <p>An error has occurred: {model.error}</p>}
                <img src={model.gifUrl} />
            </div>
        );
    },
});

render(<RandomGifs />, document.body);
