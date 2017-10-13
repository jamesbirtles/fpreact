'use strict';

var fpreact = require('..');

var Msg = {
    UpdateName: 0,
};

var Greet = fpreact.component({
    update: function(model, msg) {
        if (model == null) {
            return { name: 'world' };
        }

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
