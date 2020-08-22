import React, {Component} from 'react';
import SatSetting from './SatSetting';
import SatelliteList from './StatelliteList';
import { SAT_API_KEY, STARLINK_CATEGORY, NEARBY_SATELLITE } from '../constants';
import Axios from 'axios';
import WordlMap from './worldMap';

class Main extends Component{
    constructor(){
        super();
        //这个状态是用来接受用户click“find nearby”之后收集数据
        this.state = {
            loadingSatelllites: false,
            //初始化select为null
            selected:[],
        }
    }

    trackOnClick = () =>{
        console.log(`tracking ${this.state.selected}`);
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
                    <WordlMap />
                </div>
            </div>
        );
    }
}
export default Main;