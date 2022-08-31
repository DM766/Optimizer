import './Import.css'
import React from 'react'
import { Col, Row, Container} from 'react-bootstrap';
import { getDatabase, ref, get, child } from "firebase/database";
import ReactDOM from 'react-dom';
import app from "../Firebase"

export const Import = () => {

    let value = ""

     function GetPlaylist(){
      //Check if we have any input
        const input = document.getElementById("input")
        if(input.value === ""){
            return
          } else {
            input.value = ""
          }

          //Unmount all elements for fresh reset
          ReactDOM.unmountComponentAtNode(document.getElementById("error"))
         
          ReactDOM.unmountComponentAtNode(document.getElementById("1"))
          ReactDOM.unmountComponentAtNode(document.getElementById("2"))
          ReactDOM.unmountComponentAtNode(document.getElementById("3"))
          ReactDOM.unmountComponentAtNode(document.getElementById("4"))
          ReactDOM.unmountComponentAtNode(document.getElementById("5"))

          ReactDOM.unmountComponentAtNode(document.getElementById("text1"))
          ReactDOM.unmountComponentAtNode(document.getElementById("text2"))
          ReactDOM.unmountComponentAtNode(document.getElementById("text3"))
          ReactDOM.unmountComponentAtNode(document.getElementById("text4"))
          ReactDOM.unmountComponentAtNode(document.getElementById("text5"))

          //Grab code from database
          const database = ref(getDatabase())
            get(child(database, `code/${value}`)).then((snapshot) => {
            //If it exists, save information in local arrays
            if (snapshot.exists()) {
              const LocalIDs = []
              const LocalThumbs = []
              for(let i = 0; i < snapshot.val().IDs.length; i++){
                LocalIDs[i+1] = snapshot.val().IDs[i]
              }
              for(let x = 0; x < snapshot.val().Thumbs.length; x++){
                LocalThumbs[x+1] = snapshot.val().Thumbs[x]
              }

              for(let y = 1; y < LocalIDs.length; y++){
                //With all the information we got, create the according thumbnail and links to display to the user
                let link = React.createElement("p", {}, `https://www.youtube.com/watch?v=${LocalIDs[y]}`)
                let source = React.createElement("img", {src:LocalThumbs[y], },)
                ReactDOM.render(source, document.getElementById(`${y}`))
                ReactDOM.render(link, document.getElementById(`text${y}`))
                
              }
              console.log("Complete!")
            } else {
              //If the code doesn't exist, let the user know
              console.log("No data available");
              const error = React.createElement("h3", {color:'red'}, "Code does not exist. Please try again.")
              ReactDOM.render(error, document.getElementById("error"))
            }
          }).catch((error) => {
            
          });
    }

    //Detect change in input and store it in value
    const handleChanged = event => {
        const _title=event.target.value
        value = _title
        }

    return(
        <div className='Home'>
            <div className='Home-header'>
                <Container>
                    <Row>
                    <h2 style={{color:'white', marginTop:'2%'}}>Please enter your playlist code below</h2>
                    </Row>
                    <Row>
                        <Col id="inp">
                        <input id="input" style={{maxWidth:'10%', }} onChange={handleChanged} placeholder='Code'></input>
                        <span>      </span>
                        <button style={{}} onClick={GetPlaylist}>Enter</button>
                        </Col>
                    </Row>
                    <Row id="error" style={{marginTop:'2%'}}>

                    </Row>
                    </Container>
                    <Container style={{marginTop:'5%'}}>

                    <Row >
                          <Col id="1" className="savedVideos">
                          
                          </Col>
                        <Col id="text1" className="savedText">
                          
                        </Col>
                          </Row>
                          <Row>
                          <Col id="2" className="savedVideos">
                          
                          </Col>
                        <Col id="text2" className="savedText">
                          
                        </Col>
                        
                          </Row>
                          <Row>
                          <Col id="3" className="savedVideos">
                          
                          </Col>
                        <Col id="text3" className="savedText">
                          
                        </Col>
                        
                          </Row>
                          <Row>
                          <Col id="4" className="savedVideos">
                          
                          </Col>
                        <Col id="text4" className="savedText">
                          
                        </Col>
                        
                          </Row>
                          <Row>
                          <Col id="5" className="savedVideos">
                          
                          </Col>
                        <Col id="text5" className="savedText">
                          
                        </Col>
                        
                          </Row>
                </Container>
            </div>
        </div>
    )
}