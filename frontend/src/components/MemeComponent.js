import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'

export default class MemeComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: props.name,
            url: props.url,
            caption:props.caption
        }
    }
    render(){
        return (
            <ul class="list-group">
                <li class="list-group-item">{this.state.name}</li>
                <ul class="list-group">
                    <li class="list-group-item">{this.state.caption}</li>
                    <li class="list-group-item"><img src={this.state.url} /></li>
                </ul>
            </ul>
        )
    }
}