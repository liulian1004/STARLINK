import React, {Component} from 'react';
import {InputNumber, Button} from 'antd';

class SatSetting extends Component {
    constructor(){
        super();
        this.state = {
            observerLat: 0,
            observerLong: 0,
            observerAlt: 0,
            radius: 90,
        }
    }
    //这里onchange功能是用state来实现
    onChangeLong = (value) =>{
        this.setState({
            observerLong:value
        })
    }

    onChangeLat = (value) =>{
        this.setState({
            observerLat:value
        })
    }

    onChangeAlt = (value) =>{
        this.setState({
            observerLat:value
        })
    }

    onChangeRadius = (value) =>{
        this.setState({
            observerLat:value
        })
    }

    showSatellite = () => {
        //把新的state传给onshow function， onshow 在main里面
        this.props.onShow(this.state);
    }

    render(){
        return(
            <div className="sat-setting">
                <div className="loc-setting">
                    <p className="setting-label">Location </p>
                    <div className="setting-list two-item-col">

                        <div className="list-item">
                            <label>Longitude: </label>
                            <InputNumber
                                placeholder="longtitude"
                                min={-180}
                                max={180}
                                defaultValue={0}
                                style={{margin:"0 2px"}}
                                onChange={this.onChangeLong}
                                //onchange:每一次数据变化是就会收集，也是inputmunber里提供的功能
                            
                            />
                        </div>

                        <div className="list-item right-item">
                            <label>Latitude: </label>
                            <InputNumber
                                placeholder="latitude"
                                min={-90}
                                max={90}
                                defaultValue={0}
                                style={{margin:"0 2px"}}
                                onChange={this.onChangeLat}
                            />
                        </div>
                  
                        
                    </div>
                    <div className="setting-list">
                        <div className="list-item">
                            <label>Altitude(meters): </label>
                            <InputNumber
                                placeholder="altitude"
                                min={-413}
                                max={8850}
                                defaultValue={0}
                                style={{margin:"0 2px"}}
                                onChange={this.onChangeAlt}
                            />
                        </div>
                    </div>

                    <p className="setting-label">Restrictions</p>
                    <div className="setting-list">
                        <div className="list-item">
                            <label>Search Radius</label>
                            <InputNumber
                                min={0}
                                max={90}
                                defaultValue={0}
                                style={{margin:"0 2px"}}
                                onChange={this.onChangeRadius}
                            /> 
                        </div>
                    </div>
                    
                    <div className="show-nearby">
                        <Button
                        className="show-nearby-btn"
                        size="large"
                        onClick={this.showSatellite}
                        >
                            Find Nearby Satellites
                        </Button>
                    </div>
                </div>
            </div>
        );

    }
}

export default SatSetting;