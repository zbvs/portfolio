import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import ReactMarkdown from 'react-markdown'
import {fetchMarkdown} from "../Util";
import style from "../style.module.scss";
import assert from 'assert';
import {addRootIndex, makeIndex} from "../store/index-reducer";

function Top(props) {
    const {lines} = props;
    const filtered = lines.filter(line => line.length > 0);
    const imgRegex = /^!\[(.+)\]\((.+)\)/;
    const matchResult = filtered[0].match(imgRegex);
    assert(matchResult !== null);
    const alt = matchResult[1];
    const src = matchResult[2];

    const content = filtered.slice(1).join("\n")


    return (
        <>
            <div style={{display: "flex", marginBottom: "25px"}} align="center">
                <img style={{width: "130px", height: "130px",}} alt={alt} src={src}/>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    marginLeft: "100px",
                    textAlign: "left"
                }}>
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>

            </div>
            <hr style={{marginBottom: "25px"}}/>
        </>
    )
}


export default function Cover(props) {
    const {MDIndex, path} = props;
    const [originContent, setContent] = useState("");
    const dispatch = useDispatch();

    fetchMarkdown(path, setContent);
    const rootIndex = makeIndex("Introduce", "Introduce", []);

    useEffect(() => {
        dispatch(addRootIndex(MDIndex, rootIndex));
    }, [rootIndex]);

    let divide;
    let lines;
    if (originContent.length > 0) {
        lines = originContent.split("\n")
        for (const [idx, line] of Object.entries(lines)) {
            if (line.indexOf("- - -") === 0) {
                divide = parseInt(idx);
                break;
            }
        }
        assert(divide !== undefined);
    }

    return (
        <div className={style.cover} id={rootIndex.id}>
            {divide === undefined ? null :
                <>
                    <Top lines={lines.slice(0, divide)}/>
                    <ReactMarkdown>{lines.slice(divide + 1).join("\n")}</ReactMarkdown>
                </>
            }
        </div>
    );
}


