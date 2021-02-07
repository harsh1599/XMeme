import React, {Component} from 'react'
import MemeComponent from './MemeComponent'
import 'bootstrap/dist/css/bootstrap.css'
import { Modal } from 'react-bootstrap';

export default class MemeListComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            error:null,
            isLoaded:false,
            memeList: [],
            update: false,
            preview: false,
            updateMeme:{
                name: "",
                url: "",
                caption: ""
            }
        }
        this.onUpdate = async (e)=>{
            await this.setState({update:true});
            console.log("update: ",this.state.update);
            console.log("id: ",e.target.id);
            fetch("https://frozen-hamlet-23059.herokuapp.com/"+e.target.id)
            .then(res=>res.json())
            .then(result=>{
                this.setState({
                    updateMeme:{
                        id: e.target.id,
                        name: result.name,
                        url: result.url,
                        caption: result.caption
                    }
                });
            })
            // .then(res=>console.log('updateMeme: ',this.state.updateMeme));
        }
        this.handleClose = async (e)=>{
            await this.setState({update:false,preview:false});
            console.log("update: ",this.state.update);
        }
        this.handleSubmit = (e)=>{
            this.setState({update:false,preview:false});
            const requestOptions = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state.updateMeme)
            };
            fetch("https://frozen-hamlet-23059.herokuapp.com/"+this.state.updateMeme.id,requestOptions)
            .then(res=>res.json())
            .then(res=>console.log("res: ",res))
            .then(_=>{window.location="/"});
        }
        this.onChangeName = async (e)=>{
            await this.setState({
                updateMeme: {
                    ...this.state.updateMeme,
                    name: e.target.value
                }
            })
            console.log("Name: ",this.state.updateMeme.name);
        }
        this.onChangeUrl = async (e)=>{
            await this.setState({
                updateMeme: {
                    ...this.state.updateMeme,
                    url: e.target.value
                }
            })
            console.log("Url: ",this.state.updateMeme.url)
        }
        this.onChangeCaption = async (e)=>{
            await this.setState({
                updateMeme: {
                    ...this.state.updateMeme,
                    caption: e.target.value
                }
            });
            console.log("caption: ",this.state.updateMeme.caption)
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
            <div class="container">
                <ul class="list-group">
                    {
                        this.state.memeList.map(meme=>{
                            return (
                                <ul class="list-group">
                                    <li class="list-group-item">
                                        <MemeComponent 
                                            name={meme.name}
                                            url={meme.url}
                                            caption={meme.caption}
                                        />
                                    </li>
                                    <li class="list-group-item">
                                        <button class="update" onClick={this.onUpdate} id={meme.id}>Update</button>
                                    </li>
                                </ul>
                            )
                        }) 
                    }
                </ul>
                
                <Modal style={{opacity:1}} show={this.state.update} onHide={this.handleClose} animation={true}>
                    <Modal.Header>
                        Update
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div class="form-group">
                                <label for="name">Name:</label>
                                <input type="text" class="form-control" id="name" 
                                    onChange={this.onChangeName} value={this.state.updateMeme.name}
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label for="url">Image URL:</label>
                                <input type="text" class="form-control" id="url" 
                                    onChange={this.onChangeUrl} value={this.state.updateMeme.url}
                                    required 
                                />
                            </div>
                            <div class="form-group">
                                <label for="caption">Caption:</label>
                                <input type="text" class="form-control" id="caption" 
                                    onChange={this.onChangeCaption} value={this.state.updateMeme.caption}
                                    required 
                                />
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={this.handleSubmit}>
                            Submit
                        </button>{' '}
                        <button onClick={this.handleClose}>Cancel</button>
                    </Modal.Footer>
                    Hi
                </Modal>


            </div>
        )
    }
}