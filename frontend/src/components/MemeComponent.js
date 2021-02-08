import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'

export default class MemeComponent extends Component{
    constructor(props){
        super(props);
        console.log("props ",props);
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
                    <li class="list-group-item">
                        <a href={this.state.url} download="w3logo">
                            <img src={this.state.url} />
                        </a>
                    </li>
                </ul>
            </ul>
        )
    }
}