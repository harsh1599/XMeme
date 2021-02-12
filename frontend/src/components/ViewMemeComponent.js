import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Form, Card, FormGroup, Button, Row, Col, ListGroup, Badge, FormLabel } from 'react-bootstrap'

export default class ViewMemeComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            meme:{
                name: "",
                url: "",
                caption: ""
            },
            memeId:props.match.params.id,
            commentList:[],
            userComment:{
                memeId:props.match.params.id,
                name:"",
                text:""
            },
            disableUpdateSubmit:true
        }
        this.onCommentChange = async (e)=>{
            await this.setState({
                userComment:{
                    ...this.state.userComment,
                    text:e.target.value
                }
            })
        }
        this.onNameChange = async (e)=>{
            await this.setState({
                userComment:{
                    ...this.state.userComment,
                    name:e.target.value
                }
            })
        }
        this.onSubmitComment = (e)=>{
            e.preventDefault();
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state.userComment)
            };
            fetch('http://ec2-18-220-82-158.us-east-2.compute.amazonaws.com:8081/memes/'
            +this.state.memeId+'/comments', requestOptions)
            .then(_=>{window.location="/"+this.state.memeId});
        }
    }
    componentDidMount(){
        fetch("http://ec2-18-220-82-158.us-east-2.compute.amazonaws.com:8081/memes/"
        +this.state.memeId)
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    meme: result
                });
            }
        )
        fetch("http://ec2-18-220-82-158.us-east-2.compute.amazonaws.com:8081/memes/"+this.state.memeId+"/comments")
        .then(res => res.json())
        .then(
            (result)=>{
                this.setState({
                    commentList: result
                })
            } 
        )
    }
    render(){
        return (
            <div className="container">
                <ListGroup>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title><Badge variant='secondary'>{this.state.meme.name}</Badge></Card.Title>
                                    <Card.Text>
                                        {this.state.meme.caption}
                                    </Card.Text>
                                    <Card.Img variant="bottom" src={this.state.meme.url}  />
                                    <Card.Footer>


                                    <Form>
                                        <FormLabel>Comment</FormLabel>
                                        <FormGroup>
                                            <input type="text" class="form-control" 
                                            onChange={this.onNameChange} placeholder="Name" required/>
                                        </FormGroup>
                                        <FormGroup>
                                            <input type="text" class="form-control" 
                                            onChange={this.onCommentChange} placeholder="Comment" required/>
                                        </FormGroup>
                                        <Button onClick={this.onSubmitComment}>Submit</Button>
                                    </Form>
                                    </Card.Footer>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>



                    
                    <ListGroup style={{height:'300px', overflowY:'scroll'}}>
                        <ListGroup.Item>
                            <h4><Badge variant="secondary">Comments</Badge></h4>
                        </ListGroup.Item>
                        {
                            this.state.commentList.map(meme=>{
                                return (
                                    <ListGroup.Item>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item>
                                                <strong>{meme.name}</strong>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                {meme.text}
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </ListGroup.Item>
                                )
                            })
                        }
                    </ListGroup>
                </ListGroup>
            </div>
        )
    }
}