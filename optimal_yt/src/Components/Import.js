import './Import.css'
import React from 'react'
import {useState} from 'react'
import { Col, Row, Container} from 'react-bootstrap';
import { getDatabase, ref, get, child } from "firebase/database";
import ReactDOM from 'react-dom';
import {FixedSizeList as List} from 'react-window'

const listref = React.createRef();

export const Import = () => {

  const SingleRow = ({ index, style }) => (
    <div id='row' className={index % 2 ? 'ListItemOdd' : 'ListItemEven'}
    style={{
      ...style,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: '10px',
      borderLeft: '4px solid #1a3d6d',
      borderRight: '4px solid #1a3d6d',
      color: '#fff',
      fontWeight: 'bold',
      background: index % 2 === 0 ? '#1a1a1a' : '#222'
    }}
    >
      <img alt='' src={LocalThumbs[index]}></img>
     <a href={"https://youtube.com/watch?v=" + LocalIDs[index]}>
      {LocalTitles[index]}
    </a>
    </div>
  );

  let [LocalIDs, setLocalIDs] = useState([])
  let [LocalThumbs, setLocalThumbs] = useState([]);
  let [LocalTitles, setLocalTitles] = useState([]);
  let [plTitle, setPlTitle] = useState('');
  let [value, setValue] = useState('');

     function GetPlaylist(){

      setLocalIDs([])
      setLocalThumbs([])
      setLocalTitles([])
      setPlTitle('')

      listref.current.forceUpdate()
        const input = document.getElementById("input")
        if(input.value === ""){
            return
          } else {
            input.value = ""
          }

          //Unmount all elements for fresh reset
          ReactDOM.unmountComponentAtNode(document.getElementById("error"))

          //Grab code from database
          const database = ref(getDatabase())
            get(child(database, `code/${value}`)).then((snapshot) => {
            //If it exists, save information in local arrays
            if (snapshot.exists()) {
              for(let i = 0; i < snapshot.val().IDs.length; i++){
                setLocalIDs(prevState => {
                  const updatedArray = [...prevState];
                  updatedArray[i] = snapshot.val().IDs[i];
                  return updatedArray
                })
              }
              for(let x = 0; x < snapshot.val().Thumbs.length; x++){
                setLocalThumbs(prevState => {
                  const updatedArray = [...prevState];
                  updatedArray[x] = snapshot.val().Thumbs[x];
                  return updatedArray
                })
              }
              for(let x = 0; x < snapshot.val().Titles.length; x++){
                setLocalTitles(prevState => {
                  const updatedArray = [...prevState];
                  updatedArray[x] = snapshot.val().Titles[x];
                  return updatedArray
                })
              }
              setPlTitle(snapshot.val().Title);
              console.log("Complete!")
              listref.current.forceUpdate()
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
                        <input id="input" style={{maxWidth:'100%'}} onChange={handleChanged} placeholder='Code'></input>
                        <span>      </span>
                        <button style={{maxWidth:'100%'}} onClick={GetPlaylist}>Enter</button>
                        </Col>
                    </Row>
                    <Row id="error" style={{marginTop:'2%'}}>

                    </Row>
                    </Container>
                    <Container style={{marginTop:'2%'}}>
                        <Row>
                          <Col className="d-flex justify-content-center">
                            <h4 style={{color:'white'}}>{plTitle}</h4>
                          </Col>
                        </Row>
                   
                         <Row>
                          <Col className="d-flex justify-content-center">
                          <List ref={listref} className='' style={{borderTop: '4px solid #1a3d6d', borderBottom: '4px solid #1a3d6d', fontSize:'65%'}}
              height={500}
              itemCount={100}
              itemSize={150}
              width={450}
            >
              {SingleRow}
            </List>
                          </Col>
                         </Row>
                </Container>
            </div>
        </div>
    )
}