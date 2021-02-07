import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'

export default class ViewMemeComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoaded: false,
            meme:{
                name: "",
                url: "",
                caption: ""
            },
            id:props.match.params.id
        }
    }
    componentDidMount(){
        fetch("https://frozen-hamlet-23059.herokuapp.com/"+this.state.id)
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    meme: result
                });
                console.log("single id: "+result);
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
            <div className="container">
                <ul class="list-group">
                    <li class="list-group-item">{this.state.meme.name}</li>
                    <ul class="list-group">
                        <li class="list-group-item">{this.state.meme.caption}</li>
                        <li class="list-group-item">
                            <img src={this.state.meme.url} />
                        </li>
                    </ul>
                </ul>
            </div>
        )
    }
}