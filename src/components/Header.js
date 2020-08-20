import React, {Component} from 'react'; 
import starlinkLogo from '../assets/images/Starlink_Logo.svg';
// best pratice： 每一个js文件里只import一个compoent

class Header extends Component {
    render(){
        return (
            <header className="App-header">
                <img src={starlinkLogo} className="App-logo" alt="logo" />
                <p className="title">
                    StarLink Tracker
                </p>
            </header>
        );
    }
}
export default Header;