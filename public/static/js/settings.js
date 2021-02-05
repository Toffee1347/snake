function getConfig() {
    let settings = {
        "gameSize":"50",
        "gameSpeed":"65",
        "gameTime":"30",
        "startLength":"3",
        "head":"/static/img/gameAssets/deafult/head.png",
        "tail":"/static/img/gameAssets/deafult/tail.png",
        "corner":"/static/img/gameAssets/deafult/corner.png",
        "straight":"/static/img/gameAssets/deafult/straight.png",
        "food":"/static/img/gameAssets/deafult/food.png",
        "background":"/static/img/gameAssets/deafult/background.png",
        "up":87,
        "down":83,
        "left":65,
        "right":68,
        "upKey":"w",
        "downKey":"s",
        "leftKey":"a",
        "rightKey":"d"
    };
    let config = {};
    if (localStorage.config) {
        try {
            config = JSON.parse(localStorage.config);
        }
        catch (err) {
            localStorage.config = '{}';
        };
        for (const setting of Object.keys(settings)) {
            if (!(setting in config)) {
                config[setting] = settings[setting];
            };
        };
        if (config.gameTime < 30 || config.gameTime > 300) {
            config.gameTime = 120;
        };
    }
    else {
        config = settings;
    };
    localStorage.config = JSON.stringify(config);
    return config;
};

function setConfig(settings) {
    localStorage.config = JSON.stringify(settings);
    getConfig();
}

function setConfigItem(key, value) {
    const settings = getConfig();
    settings[key] = value;
    setConfig(settings);
    getConfig();
}

function resetConfig() {
    localStorage.clear();
    getConfig();
}