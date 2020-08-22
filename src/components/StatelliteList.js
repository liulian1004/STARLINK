import React, {Component} from 'react';
import { List, Avatar, Button, Checkbox, Spin } from 'antd';
import Satellite from "../assets/images/Satellite.svg"

class StatelliteList extends Component{
    //on change函数的具体方法
    onChange = e =>{
        //选中的卫星信息传给e.target
        const {dataInfo, checked} = e.target;
        //把states传给main
        this.props.onSelectionChange(dataInfo, checked);
    }
    render(){
        //main调用api之后拿到的state
        //api返回的list的properity是above
        const satList = this.props.satInfo? this.props.satInfo.above : [];
        return (
            <div className="sat-list-box">
                <Button className="sat-list-btn"size="large"
                //先disable button
                disabled={this.props.disableTrack}
                //click trank on map button， 触发trackOnClick 函数
                onClick={()=> this.props.trackOnclick()}
                >
                Track on the map</Button>
                <hr/>

                {
                    //发出请求后，收到response之前，显示loading内容
                    this.props.loading ?
                    <Spin tip="Loading Satellites..." /> :
                    //ant design api
                <List 
                    className="sat-list"
                    itemLayout="horizontal"
                    size="small"
                    dataSource={satList}
                    renderItem={item =>(
                        <List.Item  
                        //ckeckbox 有额外的click 功能
                            actions={[<Checkbox dataInfo ={item}
                            onChange={this.onChange}/>]}
                            >
                               <List.Item.Meta
                                    avatar={<Avatar size={50} src={Satellite} />}
                                    title ={<p>{item.satname}</p>} 
                                    description={`Launch Date: ${item.launchDate}`} 
                                />

                            </List.Item>
                    )}
                    />
                }
            </div>
        );
    }

}
export default StatelliteList;