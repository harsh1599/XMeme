import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import Meme from '../../../backend/models/Meme';

export default class MemeComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            commentList:props.commmentList
        }
    }
    render(){
        return (
            <ul class="list-group">
                {
                    this.state.commentList.map(comment=>{
                        return (
                            <li class="list-group-item">
                                
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
}