import React from 'react';
import {Menu,Icon} from 'antd';
import menuConfig from './../../config/menuConfig';
const SubMenu = Menu.SubMenu;

export default class SideBar extends React.Component{
    // constructor(props){
    //     super(props);
    //     this.state = {
    //         menuConfig
    //     }
    // }

    componentWillMount(){       //挂载组件前获取组件的DOM ，并且setState
        const dom = this.renderMenu(menuConfig);

        this.setState({
            dom
        })
    }

    renderMenu(data){      //递归渲染菜单
        return data.map((item) =>{
            if(item.children)
            {
                return (
                    <SubMenu title={<Icon type={item.Icon} /> } key={item.key}>
                        {this.renderMenu (item.children)}
                    </SubMenu>
                    
                )    
            }
            return (
                <Menu.Item key={item.key}>
                    <Icon type={item.Icon}></Icon>
                    {item.title}
                </Menu.Item>
            )
        })
    }

    render(){
        return(
            <div>
                <Menu theme="dark">
                    {this.state.dom}
                </Menu>
            </div>
        )
    }
}