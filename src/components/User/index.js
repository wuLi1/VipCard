import React from 'react';
import { Table, Row, Col, Card, Input, Select, DatePicker, Icon, Button, Tooltip, Form, List} from 'antd';
import axios from './../../axios/axios';
import converter from './../../utils/converter'
const FormItem = Form.Item;
import moment from 'moment';

export default class User extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dataSource : [],
            page : 1,        //分页计算后台node处理
            pageSize: 8,    //一页显示条数
            dayCount: 0,
            weekCount: 0,
            monthCount: 0
        }
    }

    componentDidMount(){
        this.getData();
        this.getCount();
    }
    getCount (){
        let now = moment().format('YYYY-MM-DD');
        const promise1 = axios.get({
            url : '/user/getCount',
            params : {
                timestamp : now,
                type : 'day'
            }
        })

        const promise2 = axios.get({
            url : '/user/getCount',
            params : {
                timestamp : now,
                type : 'week'
            }
        })
        
        const promise3 = axios.get({
            url : '/user/getCount',
            params : {
                timestamp : now,
                type : 'month'
            }
        })

        Promise.all([promise1, promise2, promise3]).then((resultList)=>{
            // this.state.dayCount = 
            // this.state.weekCount = 
            // this.state.monthCount = 
            this.setState({
                dayCount: JSON.parse(resultList[0].result)[0].count,
                weekCount: JSON.parse(resultList[1].result)[0].count,
                monthCount: JSON.parse(resultList[2].result)[0].count
            })
        }); 
        
    }

    getData (){
        let formData = this.formRef.props.form.getFieldsValue(); //获取子Form的数据
        let birthday;
        // this.props.getFormRef(this.formRef.getItemsValue());
        if(formData.birthday)
        {
            birthday = moment(formData.birthday).format('YYYY-MM-DD');
        }
        axios.get({
            url : '/user/get',
            isShowLoading : true,
            params : {
                page : this.state.page,
                pageSize : this.state.pageSize,
                username : formData.username || null,
                mobile : formData.mobile || null,
                sex : formData.sex || null,
                level : formData.level || null,
                birthday : birthday || null
            }
        })
        .then((response)=>{
            this.setState({
                dataSource : response.result,
                count : response.count
            })
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    changePage = (page,pageSize)=>{
        this.state.page = page;
        this.state.pageSize = pageSize;
        this.getData();
    }

    resetFields =()=>{
        this.formRef.props.form.resetFields();   //调用子Form实例的resetForm方法清空表单
        this.getData();    
    }
    
    render(){
        const listTitle = [
            {
                title: '今日注册数',
                count: this.state.dayCount
            },
            {
                title: '近一周注册数',
                count: this.state.weekCount
            },
            {
                title: '近一个月注册数',
                count: this.state.monthCount
            },

        ];
        const columns =[
            {
                title : "用户名",
                dataIndex : "username",
                key : "username",
            },   
            {
                title : "电话号码",   
                dataIndex : "mobile",
                key : "mobile",
            },
            {
                title : "性别",
                dataIndex : "sex",
                key : "sex",
                render : (sex)=>{
                    return (
                        sex == "1" ? "男" : "女"
                    )
                }
            },
            {
                title : "生日",
                dataIndex : "birthday",
                key : "birthday"
            },
            {
                title : "会员等级",
                dataIndex : "level",
                key : "level",
                render : (level)=>{
                    return (
                        level == "1" ? "Musee会员" : "Vip会员"
                    )
                }
            },
            {
                title : "注册日期",
                dataIndex : "createTime",
                key : "createTime",
                render : (createTime)=>{
                    return(
                        converter.getFullDate(createTime)
                    )
                }
            }
        ];

        return(
            <div>
                <Row>
                    <Col span={24}>
                        <List
                        style={{marginBottom:'30px',marginTop:'30px',textAlign:'center'}}
                        grid={{ gutter: 16, column: 3 }}
                        dataSource={listTitle}
                        renderItem={item => (
                            <List.Item>
                                <Card title={item.title}>{item.count}</Card>
                            </List.Item>
                        )}>
                        
                        </List>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Card title={
                            <UserForm wrappedComponentRef={(form) => this.formRef = form} />
                            }
                            extra={
                                <span>
                                    <Tooltip placement="top" title="查询">
                                        <Button onClick={()=>this.getData()} type="primary" shape="circle" icon="search" style={{marginRight:20}} />
                                    </Tooltip>
                                    <Tooltip placement="top" title="重置">
                                        <Button onClick={()=>this.resetFields()} type="primary" shape="circle" icon="reload" />
                                    </Tooltip>
                                </span>
                            } 
                            bordered={false}>
                            <Row>
                                <Col span={24} >
                                    <Table dataSource={this.state.dataSource} rowKey="id" bordered={true} rowKey="id" columns={columns}
                                        pagination={{
                                            pageSize : this.state.pageSize,
                                            current : this.state.page,
                                            // pageSizeOptions : ['5','10','15','20'],
                                            // showSizeChanger :true,
                                            total :this.state.count,
                                            onChange : this.changePage
                                        }}
                                        onRow={(record)=>{
                                            return {
                                                //onClick: () => {console.log(record)},   //此处添加事件
                                            };
                                        }}
                                    >   
                                    </Table>
                                </Col>
                            </Row>   
                        </Card>
                    </Col>
                </Row>
            </div>

        ); 
    }
}


class UserForm extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        return(
            <Form layout="inline">
                <FormItem>
                    {getFieldDecorator('username', {
                    
                    })(
                    <Input prefix={<Icon type="user" style={{color:"#655747"}} />} placeholder="输入用户名" style={{width:130,marginRight:20}} />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('mobile', {
                        
                    })(
                        <Input prefix={<Icon type="phone" style={{color:"#655747"}} />} placeholder="请输入手机号" style={{width:180,marginRight:20}} />
                    )}        
                </FormItem>
                <FormItem>
                    {getFieldDecorator('sex', {
                        
                    })(
                        <Select placeholder="请选择性别" style={{width:120,marginRight:20}}>
                            <Select.Option value={1}>男</Select.Option>
                            <Select.Option value={2}>女</Select.Option>
                        </Select>
                    )}        
                </FormItem>
                <FormItem>
                    {getFieldDecorator('level', {
                        
                    })(
                        <Select placeholder="会员等级" style={{width:130,marginRight:20}}>
                            <Select.Option value={1}>Musee会员</Select.Option>
                            <Select.Option value={2}>Vip会员</Select.Option>
                        </Select>
                    )}        
                </FormItem>
                <FormItem>
                    {getFieldDecorator('birthday', {
                        
                    })(
                        <DatePicker format="YYYY-MM-DD" allowClear={false} placeholder="选择生日" style={{marginRight:20}} />
                    )}          
                </FormItem>              
            </Form>
        )
    }
}
UserForm = Form.create({})(UserForm);