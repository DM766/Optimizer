import './Home.css';
import { Col, Row, Container} from 'react-bootstrap';
import React from 'react'
import {useState} from 'react'
import ReactDOM from 'react-dom';
import YouTube from 'react-youtube'
import { getDatabase, ref, get, child, set } from "firebase/database";
import {FixedSizeList as List} from 'react-window'
import app from "../Firebase"

function Home() {
  //Global Variables
  let [count, setCount] = useState(0)
  let [currentID, setCurrentID] = useState("")
  let [currentThumb, setCurrentThumb] = useState("")
  let [currentTitle, setCurrentTitle] = useState("")
  let [PlaylistIDs, setPlaylistIDs] = useState([])
  let [PlaylistThumbs, setPlaylistThumbs] = useState([])
  let [PlaylistTitles, setPlaylistTitles] = useState([])
  let [value, setValue] = useState("")
  const key = process.env.REACT_APP_apiKey
  const listref = React.createRef();

  const SingleRow = ({ index, style }) => (
    <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'}
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
      background: index % 2 === 0 ? '#1a1a1a' : '#222',
      textAlign: 'center'
    }}
    >
      {PlaylistTitles[index]}
    </div>
  );

  //Detect input change and assign it to value
  const handleChanged = event => {
    const _title=event.target.value
    setValue(_title)
    }

    //Function called when search button is clicked
  async function Search(){
    const updatedVideoIDs = [];
      const updatedVideoThumbs = [];
      const updatedVideoTitles = [];
    //If the input is empty, do nothing. Otherwise, set it to nothing
    const input = document.getElementById("input")
    if(input.value === ""){
      return
    } else {
      input.value = ""
    }
    
    //Remove rating text in RatingText if there is any. Create loading element and render it in the Video section
    ReactDOM.unmountComponentAtNode(document.getElementById("RatingText"))
    const loading = React.createElement("img", {src:'https://icon-library.com/images/loading-gif-icon/loading-gif-icon-19.jpg', style:{maxHeight:'150px', maxWidth:'150px'}})
    ReactDOM.render(loading, document.getElementById("Video"))

    //Fetch from YouTube API with users value and our key
    const res = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&order=relevance&maxResults=15&q=${value}&type=video&videoDefinition=high&key=${key}`, {
    }
    )
    .then((response) => response.json())
     .then((responseJSON) => {
      console.log(responseJSON)

          //For each video returned, add it to local videoIDs and videoThumbs
          for(let i = 0; i < responseJSON.items.length; i++){
              updatedVideoIDs[i] = responseJSON.items[i].id.videoId;
              updatedVideoThumbs[i] = responseJSON.items[i].snippet.thumbnails.high.url;
              updatedVideoTitles[i] = responseJSON.items[i].snippet.title;
          }
           
          
       })
    .catch(error => console.log(error))
    //Call continuation of function, GetRatings
    GetRatings(updatedVideoIDs, updatedVideoThumbs, updatedVideoTitles)
   }

  async function GetRatings(updatedVideoIDs, updatedVideoThumbs, updatedVideoTitles){
    let BestRating = null
    let BestID = ""
    let currID = ""
    let currThumb = ""
    let currTitle = ""
    //For each video ID in videoIDs, fetch its like/dislike data from following API
    for(let x = 0; x < updatedVideoIDs.length; x++){
      await fetch("https://returnyoutubedislikeapi.com/votes?videoId=" + updatedVideoIDs[x], { })
      .then((response) => response.json())
      .then((responseJSON) => {     
         console.log(responseJSON)
        //If its rating is better than what we currently have, replace it and update numerous variables
        if(responseJSON.rating > BestRating){
          BestRating =(responseJSON.rating)
          BestID = updatedVideoIDs[x]
          currID = updatedVideoIDs[x]
          currTitle = updatedVideoTitles[x]
          currThumb = updatedVideoThumbs[x]
        }
      })
      .catch(error => console.log(error))
    }

    //If we managed to get nothing out of all that, something went wrong. Search term is likely invaild, so we render error message to the user
    if(BestRating == null){
      ReactDOM.unmountComponentAtNode(document.getElementById("Video"))
            let NullMessage = React.createElement("p", {}, "An error has occured. Please try again.")
            ReactDOM.render(NullMessage, document.getElementById("Video"))
            setCurrentID("")
            setCurrentThumb("")
            setCurrentTitle("")
            return
    }
    //Clear whatever may be in Video section. Create new YouTube video that matches what we found.
    //Create new RatingText that matches its rating. Render both. Reset qualifying parameters.
    ReactDOM.unmountComponentAtNode(document.getElementById("Video"))
    let YouTubeVideo = React.createElement(YouTube, {videoId:BestID, opts:opts, onReady:0},)
    let RatingText = React.createElement("p", {}, `Video Rating (Ratio): ${BestRating.toPrecision(3)}/5` )
    ReactDOM.render(YouTubeVideo, document.getElementById("Video"))
    ReactDOM.render(RatingText, document.getElementById("RatingText"))
    setCurrentID(currID)
    setCurrentThumb(currThumb)
    setCurrentTitle(currTitle)
  }


  function SaveVideo(){
    //Flag to make sure we aren't saving more than 5 or that we aren't trying to save nothing
    setCount(count += 1)
    if(count > 100){
      setCount(count -= 1)
      alert("The maximum number of videos allowed are 100!")
      return
    }
    else if(currentThumb === ""){
      setCount(count -= 1)
      return
    }
    //Save information in according arrays (in count-1 so that we can start the arrays at 1. Will be helpful later on). Render the new information in according save column.
    setPlaylistIDs(prevState => {
      const updatedArray = [...prevState];
      updatedArray[count-1] = currentID;
      return updatedArray
    })
    setPlaylistThumbs(prevState => {
      const updatedArray = [...prevState];
      updatedArray[count-1] = currentThumb;
      return updatedArray
    })
    setPlaylistTitles(prevState => {
      const updatedArray = [...prevState];
      updatedArray[count-1] = currentTitle;
      return updatedArray
    })
    listref.current.forceUpdate()
  }

function ClearPlaylist(){
  //unmount each column and reset parameters
setPlaylistIDs([])
setPlaylistThumbs([])
setPlaylistTitles([])
setCount(0)
listref.current.forceUpdate()
}

function AddPlaylist(){
  //Check to make sure we aren't making a playlist out of nothing
  if(PlaylistIDs.length === 0){
    return
  }

  const userInput = window.prompt('Please enter a title for your playlist:')
  if (userInput !== null) {
 //Generate a new code. If the code already exists in the database, do it again. Otherwise, create the code in the database and give it parameters needed.
    //After, alert code to user.
    const database = ref(getDatabase()) 
      let r = (Math.random() + 1).toString(36).substring(7)
      get(child(database, `code/${r}`)).then((snapshot) => {
        if (snapshot.exists()) {
          AddPlaylist()
          return
        } else {
          console.log("No data available");
          set(child(database, `code/${r}`),{
            Title: userInput,
            IDs: PlaylistIDs,
            Thumbs: PlaylistThumbs,
            Titles: PlaylistTitles
          })
        }
      }).catch((error) => {
        console.error(error);
      });
      alert(`Your code is: ${r}`)
  }
  else{
    console.log("User cancelled the prompt")
  }
   
}


  const opts = {
    height: '350',
    width: '450',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };
  
  return (
    <div className="App">
      <div className="App-header">
        <div>
        </div>
        <div className="search">
          <Container>
          <Row id="firstRow" className="row" style={{}}>
            <Col className="inp">
            <div className="header" style={{marginTop:'2%', marginBottom:'2%'}}>
            <h1 style={{color:'white', marginTop:'2%'}}>Optimizer</h1>
          <h3 style={{color:'white'}}>Please Enter a search term below</h3>
          </div>

            <input style={{maxWidth:'100%'}} id="input" onChange={handleChanged}  placeholder='Enter a search term'></input>
            <span>      </span>
            <button style={{marginBottom:'2%', width:'fit-content', maxWidth:'100%'}} onClick={Search}>Search</button>
            <p style={{color:'white',}}>This app will return the highest like-to-dislike ratio youtube video matching your search term in order to find you the most optimal content.</p>
            <div id="Video">
              </  div>

              <div id ="SaveButton">
              <button onClick={SaveVideo} style={{marginTop:'1%', width:'fit-content', maxWidth:'100%'}}>Save Video</button>
              </div>
              <div id = "RatingText">

                </div>

              <div className='Code'>
                
              </div>

              <div style={{paddingBottom:'2%'}}>
        <button style={{whiteSpace:'noWrap', width:'fit-content', maxWidth:'100%'}} onClick={AddPlaylist}>Generate Playlist</button>
        <span>       </span>
        <button style={{whiteSpace:'noWrap', width:'fit-content', maxWidth:'100%'}} onClick={ClearPlaylist}>Clear</button>
        </div>
            </Col>
            <Col md={4} className="center" style={{}}>
            <List className='' style={{borderTop: '4px solid #1a3d6d', borderBottom: '4px solid #1a3d6d', fontSize:'65%'}} ref={listref}
              height={690}
              itemCount={100}
              itemSize={50}
              width={300}
            >
              {SingleRow}
            </List>
          </Col>
          </Row>
          <Row className="Code">

        </Row>
          </Container>
        </div>
      </div>
    </div>
  );
  
}

export default Home;