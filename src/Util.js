import {config} from "./Config";

export const fetchMarkdown = (path, setter) => {
    fetch(path)
        .then(r => r.text())
        .then(mdText => {
            setter(mdText);
        });
}


export const debugDivColor = () => {
    if (config.IS_DEBUG)
        return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
    return "white";
}


const LOG_LEVEL_DEBUG = 0;
const LOG_LEVEL_TRACE = 1;
const LOG_LEVEL_INFO = 2;
const LOG_LEVEL_ERROR = 3;


const LOG_LEVEL = LOG_LEVEL_INFO;

export const logger = {
    debug: (...args) => {
        if (LOG_LEVEL <= LOG_LEVEL_DEBUG)
            console.log(...args);
    },
    trace: (...args) => {
        if (LOG_LEVEL <= LOG_LEVEL_TRACE)
            console.log("[TRACE]", ...args);
    },
    info: (...args) => {
        if (LOG_LEVEL <= LOG_LEVEL_INFO)
            console.log(...args);
    },
    error: (...args) => {
        if (LOG_LEVEL <= LOG_LEVEL_ERROR)
            console.log(...args);
    }
}
