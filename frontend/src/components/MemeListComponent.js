import React, {Component} from 'react'
import MemeComponent from './MemeComponent'
import 'bootstrap/dist/css/bootstrap.css'

export default class MemeListComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            error:null,
            isLoaded:false,
            memeList: []
        }
    }
    componentDidMount(){
        fetch("https://frozen-hamlet-23059.herokuapp.com/")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    memeList: result
                });
            },
            (error) => {
                this.setState({
                    isLoaded: false,
                    error
                });
            }
        )
    }
    render(){
        return (
            <ul class="list-group">
                {
                    this.state.memeList.map(meme=>{
                        return (
                            <li class="list-group-item">
                                <MemeComponent 
                                    name={meme.name}
                                    url={meme.url}
                                    caption={meme.caption}
                                />
                            </li>
                        )
                    }) 
                }
            </ul>
        )
    }
}