import React, {Component} from 'react'
import MemeComponent from './MemeComponent'
import 'bootstrap/dist/css/bootstrap.css'
import { Modal, Button, Card, Row, Col, Form, FormGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class MemeListComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            error:null,
            isLoaded:false,
            memeList: [],
            update: false,
            updateMeme:{
                name: "",
                url: "",
                caption: ""
            }
        }
        this.onUpdate = async (e)=>{
            await this.setState({update:true});
            console.log("update: ",this.state.update);
            console.log("_id: ",e);
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
            this.setState({
                disableUpdateSubmit:false
            })
            // .then(res=>console.log('updateMeme: ',this.state.updateMeme));
        }
        this.handleDisable = (e)=>{
            if(this.state.updateMeme.name==""
            || this.state.updateMeme.url==""
            || this.state.updateMeme.caption==""
            ){
                this.setState({disableUpdateSubmit:true})
            } else this.setState({disableUpdateSubmit:false})
        }
        this.handleClose = async (e)=>{
            await this.setState({update:false});
            console.log("update: ",this.state.update);
        }
        this.handleSubmit = (e)=>{
            this.setState({update:false});
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
            this.handleDisable();
        }
        this.onChangeUrl = async (e)=>{
            await this.setState({
                updateMeme: {
                    ...this.state.updateMeme,
                    url: e.target.value
                }
            })
            this.handleDisable();
        }
        this.onChangeCaption = async (e)=>{
            await this.setState({
                updateMeme: {
                    ...this.state.updateMeme,
                    caption: e.target.value
                }
            });
            this.handleClose();
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
                        this.state.memeList.map((meme,index)=>{
                            return (
                                <Row>
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>{meme.name}</Card.Title>
                                                <Card.Text>
                                                    {meme.caption}
                                                </Card.Text>
                                                <Card.Img variant="bottom" src={meme.url}  />
                                                <Card.Footer>
                                                    <Button variant="primary" onClick={this.onUpdate} id={meme.id}>Update</Button>
                                                    <Link to={"/"+meme.id}>
                                                        <Button variant="primary" style={{marginLeft:'4px'}} onClick={this.on}>View</Button>
                                                    </Link>
                                                </Card.Footer>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            )
                        })
                    }
                    
                </ul>
                
                <Modal style={{opacity:1}} show={this.state.update} onHide={this.handleClose} animation={true}>
                    <Modal.Header>
                        Update
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <FormGroup>
                                <label for="name">Name:</label>
                                <input type="text" class="form-control" id="name" 
                                    onChange={this.onChangeName} value={this.state.updateMeme.name}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <label for="url">Image URL:</label>
                                <input type="text" class="form-control" id="url" 
                                    onChange={this.onChangeUrl} value={this.state.updateMeme.url}
                                    required 
                                />
                            </FormGroup>
                            <FormGroup>
                                <label for="caption">Caption:</label>
                                <input type="text" class="form-control" id="caption" 
                                    onChange={this.onChangeCaption} value={this.state.updateMeme.caption}
                                    required 
                                />
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" disabled={this.state.disableUpdateSubmit}
                        onClick={this.handleSubmit}>
                            Submit
                        </Button>{' '}
                        <Button variant="danger" onClick={this.handleClose}>Cancel</Button>
                    </Modal.Footer>
                </Modal>


            </div>
        )
    }
}