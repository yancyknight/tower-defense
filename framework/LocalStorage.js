'use strict';

function getSettings(path) {
    let settingsString = localStorage.getItem(path);
    if (settingsString === null) {
        // console.log("setting settings");
        return {};
    }
    else {
        // console.log("settings: " + settingsString);
        return JSON.parse(settingsString);
    }
}

function setSettings(path, {
    field,
    value
} = {}) {
    let settingsString = localStorage.getItem(path);
    if (settingsString === null) {
        // console.log("setting settings");
        var settings = {};
    }
    else {
        // console.log("settings: " + settingsString);
        var settings = JSON.parse(settingsString);
    }
    settings[field] = value;
    localStorage.setItem(path, JSON.stringify(settings));
    return settings;
}

function removeSetting(path, setting) {
    let settingsString = localStorage.getItem(path);
    if (settingsString === null) {
        return;
    }
    var settings = JSON.parse(settingsString);
    delete settings[setting];
    localStorage.setItem(path, JSON.stringify(settings));
}

function removeAllSettings(path) {
    localStorage.removeItem(path);
}


module.exports = {
    getSettings,
    setSettings,
    removeSetting,
    removeAllSettings
};
