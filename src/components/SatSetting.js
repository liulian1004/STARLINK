import React, {Component} from 'react';
import {InputNumber, Button} from 'antd';

class SatSetting extends Component {
    constructor(){
        super();
        this.state = {
            observerLat: 0,
            observerLong: 0,
            observerAlt: 0,
            radious: 90,
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

    onChangeRadious = (value) =>{
        this.setState({
            observerLat:value
        })
    }

    showSatellite = () => {
        this.props.onShow(this.state);
    }

    render(){
        return(
            <div className="sat-setting">
                <div className="loc-setting">
                    <p className="setting-label">From Location </p>
                    <div className="setting-list two-item-col">

                        <div className="list-item">
                            <label>Longitude: </label>
                            <InputNumber
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
                            <label>Elevation(meters): </label>
                            <InputNumber
                                min={-413}
                                max={8850}
                                defaultValue={0}
                                style={{margin:"0 2px"}}
                                onChange={this.onChangeEle}
                            />
                        </div>
                    </div>

                    <p className="Setting-lable">Restrictions</p>
                    <div className="setting-list">
                        <div className="list-item">
                            <label>Search Radious</label>
                            <InputNumber
                                min={0}
                                max={90}
                                defaultValue={0}
                                style={{margin:"0 2px"}}
                                onChange={this.onChangeRadious}
                            /> 
                        </div>
                    </div>
                    
                    <div className="show-nearby">
                        <Button
                        className="show-nearby-btn"
                        size="large"
                        onClick={this.showSatellite}
                        >
                            find Nearby Satellites
                        </Button>
                    </div>
                </div>
            </div>
        );

    }
}

export default SatSetting;