import assert from "assert";
import {createStore} from "redux";
import {useEffect} from "react";
import {logger} from "../Util";


export const ROOTINDEX_ADDED = "ROOTINDEX_ADDED";

const indexMap = new Map();
const initialState = [];
export const makeIndex = (id, title, childs) => {
    assert(typeof id === "string")
    assert(typeof title === "string")
    assert(Array.isArray(childs))

    return {id:id.replaceAll("\r", ""), title, childs};
}




const setScroll = () => {
    const offset = 0;
    const trigger = true;
    const scrollToHashElement = () => {
        const { hash } = window.location;
        if (!hash) return;
        const elementToScroll = document.getElementById(decodeURI(hash.replace("#", "")));
        if (!elementToScroll) return;

        window.scrollTo({
            top: elementToScroll.offsetTop - offset,
            behavior: "instant"
        });
    };

    if (!trigger) return;


    setTimeout( scrollToHashElement, 1000);
}

export const addRootIndex = (MDIndex, rootIndex) => {
    assert(typeof rootIndex.id === "string")
    assert(typeof rootIndex.title === "string")
    assert(Array.isArray(rootIndex.childs))
    setScroll();
    indexMap.set(MDIndex, rootIndex);
    const keys = [...indexMap.keys()];
    keys.sort();

    return {type: ROOTINDEX_ADDED, rootIndexes: keys.map(key => indexMap.get(key))};
}


export default function indexReducer(state = initialState, action) {

    switch (action.type) {
        case ROOTINDEX_ADDED: {
            return {...state, rootIndexes: action.rootIndexes}
        }
        default:
            return state;
    }
}


export const store = createStore(
    indexReducer
)