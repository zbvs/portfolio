import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {debugDivColor, fetchMarkdown, logger} from "../Util";
import style from "../style.module.scss";
import ReactMarkdown from "react-markdown";
import assert from 'assert';
import {addRootIndex, makeIndex} from "../store/index-reducer";

function Paragraph(props) {
    const {src, alt, lines} = props;
    const content = lines.join("\n")

    return (
        <div className={style.paragraph}>
            <div className={style.image} style={{backgroundColor: `${debugDivColor()}`}}>
                <img style={{maxWidth: "100%"}} src={src} alt={alt}/>
            </div>
            <div style={{marginTop: "20px", backgroundColor: `${debugDivColor()}`}}>
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </div>
    )
}

function HalfParagraph(props) {
    const {src, alt, lines} = props;
    const content = lines.join("\n")

    return (
        <div className={style.halfParagraph}>
            <div style={{width: "50%", padding: "20px", float: "left"}}>
                <img style={{maxWidth: "100%"}} src={src} alt={alt}/>
            </div>
            <div style={{padding: "10px"}}>
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </div>
    )
}

function Section(props) {
    const {sectionIndex, lines} = props;
    assert(lines.length > 0);
    assert(lines[0].indexOf("## ") === 0)
    const result = {header: undefined, paragraphs: []};
    const title = lines[0].substr(3)
    const imgRegex = /^(?:<half>)?!\[(.+)\]\((.+)\)/;

    let headerEnd = 1;
    while (true) {
        if (lines[headerEnd].match(imgRegex)) {
            break;
        } else if (headerEnd === lines.length - 1) {
            headerEnd++;
            break;
        } else {
            headerEnd++;
        }
    }

    result.header = (
        <div id={sectionIndex.id} className={style.paragraph} style={{backgroundColor: `${debugDivColor()}`}}>
            <ReactMarkdown>{lines.slice(0, headerEnd).join("\n")}</ReactMarkdown>
        </div>
    )


    for (let pos = headerEnd; pos < lines.length;) {
        const line = lines[pos];
        const matchResult = line.match(imgRegex);
        assert(matchResult !== null);
        const isHalf = line.startsWith("<half>");
        const alt = matchResult[1];
        const mdImgSrc = matchResult[2];
        const srcRegex = /.*(\/img\/.*)/;
        const htmlImgSrc = process.env.PUBLIC_URL + mdImgSrc.match(srcRegex)[1];
        const paragraphStart = ++pos;
        while (pos < lines.length) {
            if (lines[pos].match(imgRegex))
                break;
            pos++;
        }

        result.paragraphs.push(
            isHalf ?
                <HalfParagraph key={paragraphStart} src={htmlImgSrc} alt={alt}
                               lines={lines.slice(paragraphStart, pos)}/>
                :
                <Paragraph key={paragraphStart} src={htmlImgSrc} alt={alt} lines={lines.slice(paragraphStart, pos)}/>
        );
    }
    return (
        <>
            {result.header}
            {result.paragraphs}
        </>
    )
}


export default function Project(props) {
    const {MDIndex, path} = props;
    const [originContent, setContent] = useState("");
    const dispatch = useDispatch();
    fetchMarkdown(path, setContent);

    const projectId = path.match(/([^\/\.]+)\.([^\/]+)$/)[1];
    const result = {header: undefined, sections: []};
    let projectIndex;

    if (originContent.length > 0) {
        const lines = originContent.split("\n")
        for (let pos = 0; pos < lines.length;) {
            const line = lines[pos];
            switch (true) {
                case(line.indexOf("# ") === 0): {
                    assert(result.header === undefined)
                    const title = line.substr(2);
                    projectIndex = makeIndex(title, line.substr(2), []);

                    const start = pos++;
                    while (pos < lines.length) {
                        if (lines[pos].indexOf("## ") === 0)
                            break;
                        pos++;
                    }

                    logger.trace("Header start", start, lines.slice(start, pos));

                    result.header = (
                        <div className={style.paragraph}>
                            <ReactMarkdown>{lines.slice(start, pos).join("\n")}</ReactMarkdown>
                        </div>
                    )
                    break;
                }
                case(line.indexOf("## ") === 0): {
                    const start = pos++;
                    while (pos < lines.length) {
                        if (lines[pos].indexOf("## ") === 0)
                            break;
                        pos++;
                    }
                    const title = line.substr(3);
                    const sectionIndex = makeIndex(projectIndex.id + "/" + title, title, []);
                    projectIndex.childs.push(sectionIndex);

                    logger.trace(`Section start idx: ${start}`, lines.slice(start, pos));
                    result.sections.push(<Section key={pos} sectionIndex={sectionIndex}
                                                  lines={lines.slice(start, pos)}></Section>)
                    break;
                }
                default: {
                    pos++;
                    break;
                }
            }
        }
    }


    useEffect(() => {
        logger.trace("Project projectIndex:", projectIndex)
        if (projectIndex !== undefined) {
            dispatch(addRootIndex(MDIndex, projectIndex));
        }
    }, [projectIndex]);

    return (
        <div id={projectId} className={style.project}>
            {
                originContent.length === 0 ? null :
                    <div id={projectIndex !== undefined ? projectIndex.id : null}>
                        {result.header}
                        {result.sections}
                    </div>
            }
        </div>
    );
}
