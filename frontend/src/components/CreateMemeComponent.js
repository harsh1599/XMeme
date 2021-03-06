import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Modal, Button, Form, FormGroup, Col, Row, Card } from 'react-bootstrap';

export default class CreateMemeComponent extends Component{
    constructor(props){
        super(props);

        
        this.state = {
            meme:{
                name:"",
                url:"",
                caption:""
            },
            preview:false,
            disableSubmit:true,
            disablePreview:true
        }
        //function for handling disable preview and update buttons
        //state can't be submitted if name/url/caption is missing
        this.handleDisable = async ()=>{
            if(this.state.meme.name=="" 
                || this.state.meme.url==""
                || this.state.meme.caption==""
            ){
                await this.setState({
                    disablePreview:true,
                    disableSubmit:true
                })
            } else {
                await this.setState({
                    disablePreview:false,
                    disableSubmit:false
                })
            }
        }

        //function to detect name change and setting the state accordingly
        this.onChangeName = async (e)=>{
            await this.setState({
                meme:{
                    ...this.state.meme,
                    name: e.target.value
                }
            });
            this.handleDisable();
        }

        //function to detect url change and setting the state accordingly
        this.onChangeUrl = async (e)=>{
            await this.setState({
                meme:{  
                    ...this.state.meme,
                    url: e.target.value
                }
            })
            this.handleDisable();
        }

        //function to detect caption change and setting the state accordingly
        this.onChangeCaption = async (e)=>{
            
            await this.setState({
                meme:{
                    ...this.state.meme,
                    caption: e.target.value
                }
            })
            this.handleDisable();
        }

        //function handling submit event
        this.onSubmit = (e)=>{
            e.preventDefault();
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state.meme)
            };

            //fetch call to the db to post a meme and rerouting back to the home page.
            fetch("http://ec2-18-220-82-158.us-east-2.compute.amazonaws.com:8081/memes", requestOptions)
            .then(response=>response.json())
            .then(_=>{window.location="/"});

        }
        //functions for showing/hiding preview modal.
        this.onPreview = (e)=>{
            this.setState({
                preview:true
            })
        }
        this.handleClose = (e)=>{
            this.setState({
                preview:false
            })
        }
    }
    render(){
        return (
            <div class="container">
                <Form>
                    <h4>XMeme</h4>
                    <FormGroup>
                        <Row>
                            <Col>
                                <input type="text" class="form-control" id="name"
                                onChange={this.onChangeName} required placeholder="Name"
                                />
                            </Col>
                            <Col>
                                <input type="text" class="form-control" id="url"
                                onChange={this.onChangeUrl} required placeholder="Image URL"
                                />
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <input type="text" class="form-control" id="caption" 
                        onChange={this.onChangeCaption} required placeholder="Caption"
                        />
                    </FormGroup>
                </Form>
                <Button variant="light" onClick={this.onPreview} disabled={this.state.disablePreview} style={{marginReft:"4px"}}>Preview</Button>
                <Button variant="success"onClick={this.onSubmit} disabled={this.state.disableSubmit}>Submit</Button>
                <Modal style={{opacity:1}} show={this.state.preview} onHide={this.handleClose} animation={true}>
                <Modal.Header>
                    Preview
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <Card.Title>{this.state.meme.name}</Card.Title>
                            <Card.Text>
                                {this.state.meme.caption}
                            </Card.Text>
                            <Card.Img variant="bottom" src={this.state.meme.url}  />
                        </Card.Body>
                    </Card>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.onSubmit}>Submit</Button>
                    <Button onClick={this.handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal>
            </div>
        )
    }
}