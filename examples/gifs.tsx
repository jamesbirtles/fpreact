import { h, component, render, Dispatcher, r } from '..';

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

function getRandomGif(topic: string) {
    return (dispatch: Dispatcher<Msg>) => {
        fetch('https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=' + topic)
            .then(res => {
                if (res.status !== 200) {
                    throw new Error(`Unexpected response from server: ${res.status}`);
                }

                return res.json();
            })
            .then(res => r(res.data.image_url))
            .catch(err => r(null, err))
            .then(dispatch(Msg.NewGif));
    };
}

const RandomGifs = component<Model, Msg>({
    model: {
        topic: 'cats',
        gifUrl: '',
        error: '',
    },

    init(model, dispatch) {
        dispatch(Msg.MorePlease)();
    },

    update(msg, model) {
        switch (msg.kind) {
            case Msg.MorePlease:
                return [model, getRandomGif(model.topic)];
            case Msg.NewGif:
                if (!msg.result.ok) {
                    return { ...model, error: msg.result.err!.message };
                }

                return { ...model, gifUrl: msg.result.get(), error: '' };
            case Msg.UpdateTopic:
                return { ...model, topic: msg.result.get() };
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
