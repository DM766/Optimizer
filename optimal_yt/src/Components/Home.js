import './Home.css';
import { Col, Row, Container} from 'react-bootstrap';
import React from 'react'
import ReactDOM from 'react-dom';
import YouTube from 'react-youtube'
import { getDatabase, ref, get, child, set } from "firebase/database";
import app from "../Firebase"

function Home() {

  

  //Global Variables
  let count = 0
  let currentID = ""
  let currentThumb = ""
  let PlaylistIDs = []
  let PlaylistThumbs = []
  var value = ""
  const key = "AIzaSyBAExkVBI7v92ieUWmOy9auQNj4Yw7qJEU"
  var videoIDs = []
  let videoThumbs = []
  let bestRating = null
  let bestId = ""

 
  //Detect input change and assign it to value
  const handleChanged = event => {
    const _title=event.target.value
    value = _title
    }

    //Function called when search button is clicked
  async function Search(){
    //If the input is empty, do nothing. Otherwise, set it to nothing
    const input = document.getElementById("input")
    if(input.value === ""){
      return
    } else {
      input.value = ""
    }
    
    //Remove rating text in RatingText if there is any. Create loading element and render it in the Video section
    ReactDOM.unmountComponentAtNode(document.getElementById("RatingText"))
    const loading = React.createElement("img", {src:'https://icon-library.com/images/loading-gif-icon/loading-gif-icon-19.jpg'})
    ReactDOM.render(loading, document.getElementById("Video"))

    //Fetch from YouTube API with users value and our key
    const res = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&order=relevance&maxResults=15&q=${value}&type=video&videoDefinition=high&key=${key}`, {
    }
    )
    .then((response) => response.json())
     .then((responseJSON) => {
          //For each video returned, add it to local videoIDs and videoThumbs
          for(var i = 0; i < responseJSON.items.length; i++){
           videoIDs[i] = responseJSON.items[i].id.videoId
           videoThumbs[i] = responseJSON.items[i].snippet.thumbnails.high.url
          }
       })
    .catch(error => console.log(error))
   
    //Call continuation of function, GetRatings
    GetRatings()
   }

  async function GetRatings(){
    //For each video ID in videoIDs, fetch its like/dislike data from following API
    for(var x = 0; x < videoIDs.length; x++){
      await fetch("https://returnyoutubedislikeapi.com/votes?videoId=" + videoIDs[x], { })
      .then((response) => response.json())
      .then((responseJSON) => {     
        //If its rating is better than what we currently have, replace it and update numerous variables
        if(responseJSON.rating > bestRating){
          bestRating = responseJSON.rating
          bestId = videoIDs[x]
          currentID = videoIDs[x]
          currentThumb = videoThumbs[x]
        }
      })
      .catch(error => console.log(error))
    }

    //If we managed to get nothing out of all that, something went wrong. Search term is likely invaild, so we render error message to the user
    if(bestRating == null){
      ReactDOM.unmountComponentAtNode(document.getElementById("Video"))
            let NullMessage = React.createElement("p", {}, "An error has occured. Please try again.")
            ReactDOM.render(NullMessage, document.getElementById("Video"))
            currentID = ""
            currentThumb = ""
            return
    }
    //Clear whatever may be in Video section. Create new YouTube video that matches what we found.
    //Create new RatingText that matches its rating. Render both. Reset qualifying parameters.
    ReactDOM.unmountComponentAtNode(document.getElementById("Video"))
    let YouTubeVideo = React.createElement(YouTube, {videoId:bestId, opts:opts, onReady:0})
    let RatingText = React.createElement("p", {}, `Video Rating (Ratio): ${bestRating.toPrecision(3)}/5` )
    ReactDOM.render(YouTubeVideo, document.getElementById("Video"))
    ReactDOM.render(RatingText, document.getElementById("RatingText"))
     videoIDs = []
   bestRating = null
   bestId = ""
  }


  function SaveVideo(){
    //Flag to make sure we aren't saving more than 5 or that we aren't trying to save nothing
    count++
    if(count > 5){
      return
    }
    else if(currentThumb === ""){
      count--
      return
    }
    //Save information in accordnig arrays (in count-1 so that we can start the arrays at 1. Will be helpful later on). Render the new information in according save column.
    PlaylistIDs[count-1] = currentID
    PlaylistThumbs[count-1] = currentThumb
    let thumbnail = React.createElement("img", {src:currentThumb})
    let colNum = count.toString()
    ReactDOM.render(thumbnail, document.getElementById(colNum))
  }

function ClearPlaylist(){
  //unmount each column and reset parameters
  for(let i = 1; i <= PlaylistIDs.length; i++){
    ReactDOM.unmountComponentAtNode(document.getElementById(i.toString()))
  }
PlaylistIDs = []
PlaylistThumbs = []
count = 0
}

function AddPlaylist(){
  //Check to make sure we aren't making a playlist out of nothing
  if(PlaylistIDs.length === 0){
    return
  }

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
            IDs: PlaylistIDs,
            Thumbs: PlaylistThumbs
          })
        }
      }).catch((error) => {
        console.error(error);
      });
      alert(`Your code is: ${r}`)
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
        
        <div className="header">
          <h1 style={{color:'white', marginTop:'2%'}}>Optimizer</h1>
          <h2 style={{color:'white'}}>Please Enter a search term below</h2>
        </div>
        <div>
        </div>
        <div className="search">
          <Container>
          <Row className="row">
            <Col className="inp">
            <input id="input" onChange={handleChanged}  placeholder='Enter a search term'></input>
            <span>      </span>
            <button onClick={Search}>Search</button>
            </Col>
          </Row>
          <Row className="flex">
          <p style={{color:'white',}}>This app will return the highest like-to-dislike ratio youtube video matching your search term in order to find you the most optimal content.</p>
          </Row>
          </Container>
        </div>
        <div id="Video">

        
        </div>
        
        <div id ="SaveButton">
          <button onClick={SaveVideo} style={{marginTop:'2%'}}>Save Video</button>
        </div>
        <div id = "RatingText">

        </div>
        <Container>
        <Row className="Code">

        </Row>
        <Row>
          <Col id="4" className="savedVideos">
          
          </Col>
          <Col id="2" className="savedVideos">
          
          </Col>
          <Col id="1" className="savedVideos">
          
          </Col>
          <Col id="3" className="savedVideos">
          
          </Col>
          <Col id="5" className="savedVideos">
          
          </Col>
        </Row>
        </Container>
        <div>
        <button onClick={AddPlaylist}>Generate Playlist</button>
        <span>       </span>
        <button onClick={ClearPlaylist}>Clear</button>
        </div>
      </div>
    </div>
  );
  
}

export default Home;
