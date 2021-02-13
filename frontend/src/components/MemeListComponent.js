import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Modal, Button, Card, Row, Col, Form, FormGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class MemeListComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            error:null,
            memeList: [],

            //update state for showing/hiding update modal
            update: false,
            //updated meme state
            updateMeme:{
                name: "",
                url: "",
                caption: ""
            }
        }

        //async function for retrieving details required to prefill in the modal
        //and update the updateMeme state.
        this.onUpdate = async (e)=>{
            await this.setState({update:true});
            fetch("http://ec2-18-220-82-158.us-east-2.compute.amazonaws.com:8081/memes/"
            +e.target.id)
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
        }

        //update can't be submitted even if one of url/caption is null
        //enable/disable accordingly.
        this.handleDisable = (e)=>{
            if(this.state.updateMeme.url==""
            || this.state.updateMeme.caption==""
            ){
                this.setState({disableUpdateSubmit:true})
            } else this.setState({disableUpdateSubmit:false})
        }

        //function for handling modal close
        this.handleClose = async (e)=>{
            await this.setState({update:false});
        }

        //function for handling submitting updated meme state.
        this.handleSubmit = async (e)=>{
            e.preventDefault();
            this.handleClose();
            const requestOptions = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state.updateMeme)
            };
            fetch("http://ec2-18-220-82-158.us-east-2.compute.amazonaws.com:8081/memes/"
            +this.state.updateMeme.id,requestOptions) 
            window.location="/";
        }
        //function to detect name change and setting the state accordingly.
        this.onChangeName = async (e)=>{
            await this.setState({
                updateMeme: {
                    ...this.state.updateMeme,
                    name: e.target.value
                }
            })
            this.handleDisable();
        }
        //function to detect url change and setting the state accordingly
        this.onChangeUrl = async (e)=>{
            await this.setState({
                updateMeme: {
                    ...this.state.updateMeme,
                    url: e.target.value
                }
            })
            this.handleDisable();
        }
        //function to detect caption change and setting the state accordingly
        this.onChangeCaption = async (e)=>{
            await this.setState({
                updateMeme: {
                    ...this.state.updateMeme,
                    caption: e.target.value
                }
            });
            this.handleDisable();
        }
    }

    //get all the memes once the component mounts
    componentDidMount(){
        fetch("http://ec2-18-220-82-158.us-east-2.compute.amazonaws.com:8081/memes")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    memeList: result
                });
            }
        )
    }
    render(){
        return (
            <div class="container" style={{height:'600px',overflowY:'scroll'}}>
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