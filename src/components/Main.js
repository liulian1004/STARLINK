import React, {Component} from 'react';
import SatSetting from './SatSetting';
import SatelliteList from './StatelliteList';
import { SAT_API_KEY, STARLINK_CATEGORY, NEARBY_SATELLITE,SATELLITE_POSITION_URL  } from '../constants';
import Axios from 'axios';
import WordlMap from './WorldMap';
import * as d3Scale from 'd3-scale';
import { schemeCategory10  } from 'd3-scale-chromatic';
import { timeFormat as d3TimeFormat } from 'd3-time-format';
import { select as d3Select } from 'd3-selection';
import { geoKavrayskiy7 } from 'd3-geo-projection';

const width = 960;
const height = 600;

class Main extends Component{
    constructor(){
        super();
        //这个状态是用来接受用户click“find nearby”之后收集数据
        //state状态初始化值
        this.state = {
            loadingSatelllites: false,
            loadingSatPositions:false,
            //初始化select为null
            setting: undefined,
            selected:[],
        }
        this.refTrack = React.createRef();
    }

    trackOnClick = (duration) => {
        //deconstructer，对三个变量赋值
        const { observerLat, observerLong, observerAlt } = this.state.setting;
        //把用户输入的duration从秒转化成分钟
        const endTime = duration * 60;
        this.setState({ 
          loadingSatPositions: true,
          duration: duration //update duration值
        });
        const urls = this.state.selected.map( sat => {
            const { satid } = sat;
            const url = `${SATELLITE_POSITION_URL}/${satid}/${observerLat}/${observerLong}/${observerAlt}/${endTime}/&apiKey=${SAT_API_KEY}`;
            return Axios.get(url);
        });
  
        Axios.all(urls)
          .then(
            Axios.spread((...args) => { //...args: 用于表示不确定的type的函数
                return args.map(item => item.data); //对每一个api的response里面只要里面的data，返回一个新的数组
            })
          )
          //then: 上一个return的数据可以用于下一段then中
          //把return的数组赋值给res，进行下一步操作
          .then( res => {
              this.setState({
                  satPositions: res,
                  loadingSatPositions: false,
              });
              this.track(); //做画
          })
          .catch( e => {
              console.log('err in fetch satellite position -> ', e.message);
          })
          
  
      }
  
    addOrRemove = (item, status) =>{
        //==> let list = this.state.selected;
        let{selected:list} = this.state;
        const found = list.some( entry => entry.satid === item.satid);
        //如果已经click，但是在list中没有发现
        //加入到list中
        if(status && !found){
            list.push(item);
        }
        //如果没有click，但是在list中有
        //从list中删除
        if(!status && found){
            //filter：运行结果是true，把结果放在list里
            //entry：list里面的每一个元素
            list = list.filter( entry => {
                //这里return可写不可以写，不写就不能加{},需要和entry写在一行里
                return entry.satid !== item.satid;
            })
        }
       // console.log(list); //用于在浏览器后台看下逻辑是否正确
        //跟新state，并放到list中
        this.setState({
            selected:list
        })
    }
    
    
//拿到state：（find nearby时收集数据）之后call fetchSatellite api
    showNearbySatellite = (setting) => {
        this.setState({
            setting:setting,
        })
        this.fetchSatellite(setting);
    }
    fetchSatellite = (setting) =>{
        //destructure
        // ==
        // const observerLat = setting.observerLat
        //变量从setting里面拿
        const {observerLat, observerLong, observerAlt, radius} = setting;
        const url = 
        `${NEARBY_SATELLITE}/${observerLat}/${observerLong}/${observerAlt}/${radius}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;
        //发送request只，loading显示为true
        this.setState({
            loadingSatelllites:true,
        })
        //get:发送请求
        //then/error: 得到response后执行的函数，
        //失败来执行error，成功来执行then里面的function
        Axios.get(url)
        .then(response => {
            this.setState({
                satInfo:response.data,
                //request成功，loading设置为false
                loadingSatelllites:false,
                selected: [],
            })
        })
        //error catch
        .catch(error => {
            console.log('err in fetch satellite -> ', error);
            this.satState({
                //request成功，loading设置为false
                loadingSatelllites:false,
            })
        })
    }

    track = () => {
        const data = this.state.satPositions;
  
        const len = data[0].positions.length;
        const duration = this.state.duration;
  
        const canvas2 = d3Select(this.refTrack.current) //给canvas2添加属性
        //属性和原来的canvas一样，所以两个画布可以重叠
              .attr("width", width)
              .attr("height", height);
        const context2 = canvas2.node().getContext("2d");
  
        let now = new Date();
        let i = duration;
  //每隔1000s秒，做一次画/打一个点
        let timer = setInterval( () => {
            let timePassed = Date.now() - now;
            if(i === duration) {
                now.setTime(now.getTime() + duration * 60)
            }
            //擦除canvas和time
            let time = new Date(now.getTime() + 60 * timePassed);
            context2.clearRect(0, 0, width, height); //擦除上一次画的点和画布
            context2.font = "bold 14px sans-serif";
            context2.fillStyle = "#333";
            context2.textAlign = "center";
            context2.fillText(d3TimeFormat(time), width / 2, 10);
  
            if(i >= len) {
                clearInterval(timer); // 超过track的时间，把timer清楚
                this.setState({isDrawing: false});
                return;
            }
            data.forEach( sat => {
                const { info, positions } = sat;
                this.drawSat(info, positions[i], context2)
            });
            //duration 每次更新一分钟
            i += 60;
        }, 1000)
    }
  //helper function，给卫星打点
    drawSat = (sat, pos, context2) => {
        const { satlongitude, satlatitude } = pos;
        if(!satlongitude || !satlatitude ) return;
        const { satname } = sat;
        const nameWithNumber = satname.match(/\d+/g).join('');
  
        const projection = geoKavrayskiy7()
              .scale(170)
              .translate([width / 2, height / 2])
              .precision(.1);
  
        const xy = projection([satlongitude, satlatitude]);
        context2.fillStyle = d3Scale.scaleOrdinal(schemeCategory10)(nameWithNumber);
        context2.beginPath();
        context2.arc(xy[0], xy[1], 4, 0, 2*Math.PI);
        context2.fill();
        context2.font = "bold 11px sans-serif";
        context2.textAlign = "center";
        context2.fillText(nameWithNumber, xy[0], xy[1]+14);
    }
  

    render(){
        return (
            <div className='main'>
                <div className="left-side">
                
                    <SatSetting onShow={this.showNearbySatellite}/>
                    <SatelliteList satInfo={this.state.satInfo}
                    loading={this.state.loadingSatelllites}
                    onSelectionChange={this.addOrRemove}
                    disableTrack={this.state.selected.length === 0}
                    trackOnClick={this.trackOnClick}
                    />
                </div>
                <div className="right-side">
                    <WordlMap 
                    refTrack = {this.refTrack}
                    loading = {this.state.loadingSatPositions}/>
                </div>
            </div>
        );
    }
}
export default Main;