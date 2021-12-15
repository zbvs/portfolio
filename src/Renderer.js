import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from "react";
import Cover from "./compoment/Cover"
import style from "./style.module.scss";
import ContentIndex from "./compoment/ContentIndex";
import Project from "./compoment/Project";
import kiwizzle from "./markdown/kiwizzle.md";
import hotsix from "./markdown/hotsix.md";
import cover from "./markdown/cover.md";
import {grid} from "./Grid"
import {Col, Row} from "react-bootstrap";
import {Provider} from "react-redux";
import {store} from "./store/index-reducer";
import {config} from "./Config";



function Renderer() {

    const targets = [];
    targets.push(<Cover key={targets.length} MDIndex={targets.length} path={cover}/>)
    targets.push(<Project key={targets.length} MDIndex={targets.length} path={kiwizzle}></Project>)
    targets.push(<Project key={targets.length} MDIndex={targets.length} path={hotsix}></Project>)


    return (
        <Provider store={store}>
            <div className={style.body}>
                <Row>
                    <Col xs={grid.horizontal}>
                        {config.IS_PDF ? null : <ContentIndex/>}
                    </Col>

                    <Col xs={12 - grid.horizontal * 2}>
                        {targets}
                    </Col>

                    <Col xs={grid.horizontal}/>
                </Row>

            </div>
        </Provider>
    );
}

export default Renderer;
