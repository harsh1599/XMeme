import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import $ from 'jquery'

export default class CreateMemeComponent extends Component{
    constructor(props){
        super(props);

        
        this.state = {
            name: "",
            url: "",
            caption: ""
        }
        
        this.onChangeName = (e)=>{
            this.setState({
                name: e.target.value
            })
        }

        this.onChangeUrl = (e)=>{
            this.setState({
                url: e.target.value
            })
        }

        this.onChangeCaption = (e)=>{
            this.setState({
                caption: e.target.value
            })
        }

        this.onSubmit = (e)=>{
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state)
            };
            // e.preventDefault();
            fetch("http://localhost:5000/memes", requestOptions)
            .then(response=>response.json())
            .then(response=>console.log("response on post: ",response));
            console.log("current state: ", this.state);
        }
    }
    render(){
        return (
            <form>
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" class="form-control" id="name" onChange={this.onChangeName} required />
                </div>
                <div class="form-group">
                    <label for="url">Image URL:</label>
                    <input type="text" class="form-control" id="url" onChange={this.onChangeUrl} required />
                </div>
                <div class="form-group">
                    <label for="caption">Caption:</label>
                    <input type="text" class="form-control" id="caption" onChange={this.onChangeCaption} required />
                </div>
                <button type="submit" class="btn btn-submit" onClick={this.onSubmit}>Submit</button>
            </form>
        )
    }
}