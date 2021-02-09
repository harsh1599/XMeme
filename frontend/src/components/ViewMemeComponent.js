import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Form, Card, FormGroup, Button, Row, Col } from 'react-bootstrap'

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
            memeId:props.match.params.id,
            commentList:[],
            userComment:{
                memeId:props.match.params.id,
                name:"",
                text:""
            }
        }
        this.onCommentChange = async (e)=>{
            await this.setState({
                userComment:{
                    ...this.state.userComment,
                    text:e.target.value
                }
            })
            console.log("comment: ", this.state.userComment.text);
        }
        this.onNameChange = async (e)=>{
            await this.setState({
                userComment:{
                    ...this.state.userComment,
                    name:e.target.value
                }
            })
            console.log("name: ", this.state.userComment.name);
        }
        this.onSubmitComment = (e)=>{
            e.preventDefault();
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state.userComment)
            };
            fetch('https://frozen-hamlet-23059.herokuapp.com/'+this.state.memeId+'/comments', requestOptions)
            .then(_=>{window.location="/"+this.state.memeId});
        }
    }
    componentDidMount(){
        fetch("https://frozen-hamlet-23059.herokuapp.com/"+this.state.memeId)
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
        fetch("https://frozen-hamlet-23059.herokuapp.com/"+this.state.memeId+"/comments")
        .then(res => res.json())
        .then(
            (result)=>{
                this.setState({
                    commentList: result
                })
            } ,
            (error)=>{
                console.log("Error hai bhaiya");
            }
        )
    }
    render(){
        return (
            <div className="container">
                <ul class="list-group">
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>{this.state.meme.name}</Card.Title>
                                    <Card.Text>
                                        {this.state.meme.caption}
                                    </Card.Text>
                                    <Card.Img variant="bottom" src={this.state.meme.url}  />
                                    <Card.Footer>


                                    <Form>
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



                    
                    <ul class="list-group">
                        {
                            this.state.commentList.map(meme=>{
                                return (
                                    <ul class="list-group">
                                        <li class="list-group-item">
                                            <strong>{meme.name}</strong>
                                        </li>
                                        <li class="list-group-item">
                                            {meme.text}
                                        </li>
                                    </ul>
                                )
                            })
                        }
                    </ul>
                </ul>
            </div>
        )
    }
}