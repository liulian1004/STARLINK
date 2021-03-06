import React, {Component} from 'react';
import { feature } from 'topojson-client'; //分析数据
import axios from 'axios';
import { geoKavrayskiy7 } from 'd3-geo-projection'; //d3-geo用于绘制track和地图
import { geoGraticule, geoPath } from 'd3-geo';
import { select as d3Select } from 'd3-selection';

import { WORLD_MAP_URL } from "../constants";
import { Spin } from 'antd';

const width = 960;
const height = 600;

class WorldMap extends Component {
    constructor(){
        super();
        this.state = {
            map: null
        }
        this.refMap = React.createRef();
    }
//compoent刚上树的是
    componentDidMount() {
        //刚上树的时候先通过url来create 一个map
        axios.get(WORLD_MAP_URL)
            .then(res => {
                const { data } = res;
                const land = feature(data, data.objects.countries).features;
                this.generateMap(land);
            })
            .catch(e => console.log('err in fecth world map data ', e))
    }

    generateMap(land){
        const projection = geoKavrayskiy7() //选择相应的样式
            .scale(170)
            .translate([width / 2, height / 2])
            .precision(.1);

        const graticule = geoGraticule();

        const canvas = d3Select(this.refMap.current)
        //画布的宽和高
            .attr("width", width)
            .attr("height", height);

        let context = canvas.node().getContext("2d");

        let path = geoPath()
            .projection(projection)
            .context(context);

        land.forEach(ele => {
            // draw the countries
            context.fillStyle = '#B3DDEF';
            context.strokeStyle = '#000';
            context.globalAlpha = 0.7;
            context.beginPath();
            path(ele);
            context.fill();
            context.stroke();
                //以下两段代码和draw countries没有关系
                //只是加入这个for loop为了多循环几次
                //每多循环一次，颜色和线回加深，显示的更清楚而已
            // draw 经玮网格
            context.strokeStyle = 'rgba(220, 220, 220, 0.1)';
            context.beginPath();
            path(graticule());
            context.lineWidth = 0.1;
            context.stroke();


            // draw 经玮网格外框
            context.beginPath();
            context.lineWidth = 0.5;
            path(graticule.outline());
            context.stroke();
        })
    }

    render() {
        return (
            <div className="map-box">
                {/* 生成一个canvas来显示地图 */}
                <canvas className="map" ref={this.refMap} />
                {/* 生成一个新的canvas覆盖原来的canvas 用来描绘轨迹 */}
                <canvas className="track" ref ={this.props.refTrack} />
                <div className="hint"></div>
                {/* 在loading的过程中，显示文字“loading”否则就不显示任何字 */}
                {
                    (this.state.loadingMap || this.props.loading) ? 
                    <Spin tip="loading..." /> : <></>
                }
            </div>
        );
    }
}

export default WorldMap;
