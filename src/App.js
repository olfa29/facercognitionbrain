import React, {Component} from 'react';
import ParticlesBg from 'particles-bg'
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

///////////////////////////////////////////////////////////////////////////////////////////////////
// In this section, we set the user authentication, user and app ID, model details, and the URL
// of the image we want as an input. Change these strings to run your own example.
//////////////////////////////////////////////////////////////////////////////////////////////////

// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = '20cbe5f3d036456b804b3966066912e3';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'clarifai';
const APP_ID = 'main';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';


const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                    // "base64": IMAGE_BYTES_STRING
                }
            }
        }
    ]
});

const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
};                                                                      



class App extends Component  {
  constructor(){
    super();
    this.state ={
      input:'',
      imageURL:'',
      box:{},
      route:'signin',
      isSignedIn:false
    }
  }

 calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
    leftCol: clarifaiFace.left_col*100,
    topRow: clarifaiFace.top_row*100 ,
    rightCol: (1-clarifaiFace.right_col)*100 ,
    bottomRow: (1-clarifaiFace.bottom_row)*100 ,
  }
  }


  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange=(event)=>{
    this.setState({input:event.target.value})
  }

  onButtonSubmit = () => {
  this.setState({ imageURL: this.state.input }, () => {
    const image = document.getElementById('inputimage');
    
    if (image.complete) {
      this.handleImageSubmit();
    } else {
      image.onload = () => {
        this.handleImageSubmit();
      };
    }
  });
};

handleImageSubmit = () => {
  fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions, this.state.input)
    .then(response => response.json())
    .then(result => {
      console.log(result);
      this.displayFaceBox(this.calculateFaceLocation(result));
    })
    .catch(error => console.log('error', error));
};

onRouteChange = (route)=>{
  if (route==='signout'){
    this.setState({isSignedIn:false})
  }else if (route==='home'){
    this.setState({isSignedIn:true})
  }
  this.setState({route:route})
}
  render(){
    const {isSignedIn,box,imageURL,route}=this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route==='home'
         ?<div>
            <Logo />
            <Rank/>
            <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit}/>
                 
            <FaceRecognition box={box} imageURL={imageURL}/>
          </div>
        : ( route=== 'signin' 
            ? <Signin onRouteChange={this.onRouteChange}/>
            : <Register onRouteChange={this.onRouteChange}/>

            )
      }
      </div>
    );
  }
  
}

export default App;
