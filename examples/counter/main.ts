// Counter Example using Xpell-UI

import {
    Xpell as _x,
    XUI,
    XData as _xd,
} from "xpell-ui"

async function main() {
    // Start the Xpell engine (real-time frame loop)
    _x.start()

    // Load XUI module
    _x.loadModule(XUI)

    // Create the Xpell player container automatically
    // <div id="xplayer" class="xpell-root"></div> will be added to the DOM
    XUI.createPlayer("xplayer", "xpell-root", undefined, true)

    // Initialize reactive data source
    _xd._o["counter"] = 0

    // Build UI using XObjects
    XUI.add({
        _type: "view",
        _id: "counter-home",
        class: "counter-home",
        _children: [
            {
                _type: "label",
                _id: "counter-title",
                _text: "Xpell Counter Example",
                style: "font-size: 2em; margin-bottom: 16px;",
            },

            {
                _type: "label",
                _id: "counter-label",
                _data_source: "counter",
                _on_data: (xobj, value) => {
                    xobj._text = "Counter: " + value
                },
                style: "font-size: 1.5em; margin-bottom: 12px;",
            },

            {
                _type: "button",
                _id: "counter-button",
                _text: "Increment",
                class: "counter-button",
                style: "padding: 10px 20px; font-size: 1.2em; cursor: pointer;",
                _on_click: () => {
                    _xd._o["counter"]++
                },
            },
        ],
    })
}

main()
