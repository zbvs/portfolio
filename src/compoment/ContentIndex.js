import React from 'react';
import {logger} from "../Util";
import {shallowEqual, useSelector} from "react-redux";



export default function ContentIndex() {
    const {rootIndexes} = useSelector((state) => {
        return {
            rootIndexes: state.rootIndexes
        }
    }, shallowEqual);


    logger.trace("ContentIndex rootIndexes:", rootIndexes);

    const renderList = (indexes, depth) => {
       const list = [];
       for (const key in indexes) {
           const index = indexes[key];
           list.push(
               <div key={key}>
                   <span>{"  ".repeat(depth)}</span>
                   <a style={{paddingLeft:`${depth*20}px`, fontSize:"15px"}} href={"#" + index.id}>{index.title}</a>
                   {renderList(index.childs, depth + 1)}
               </div>
           );
       }
       return list;
    }

    return (
        <div style={{position:"fixed", top:"150px"}}>
            {renderList(rootIndexes, 0)}
        </div>
    )
}