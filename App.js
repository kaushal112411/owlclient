import * as React from 'react';
// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,Image,TouchableOpacity,Dimensions,Linking,Modal
} from 'react-native';
//import { IconButton, Colors } from 'react-native-paper'
import { useState, useEffect,useRef } from 'react';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { EvilIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Header as HeaderRNE, HeaderProps, Icon } from '@rneui/themed';
import {LinearGradient}  from 'expo-linear-gradient';
import {logo} from "./assets/Frame.png"
//import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Grid, Row, Col } from 'react-native-flexbox-grid';
import {
  Button,
  SafeAreaView,
  Alert,
} from 'react-native';
const Separator = () => <View style={styles.separator} />;

export default function App() {
  // const [uploaddata,setUploaddata] = useState()
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  // const [captured,setCaptured] = useState(false)
  const [base,setBase] = useState("")
  const [base64Image, setBase64Image] = useState(null);
  const [genereted,setGenerated] = useState(false)
  const [response,setResponse] = useState({});
  const [loader,setLoader] = useState(true)
  const [showmodal,setShowmodal] = useState(false)
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);


  const docsNavigate = () => {
    Linking.openURL(`https://reactnativeelements.com/docs/${props.view}`);
  };
  
  const playgroundNavigate = () => {
    Linking.openURL(`https://www.alvyl.com/`);
  };
  

  const toggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };
  const openCamera = () => {
    setIsCameraOpen(true);
    setCapturedImage(null)
    setBase64Image(null);
  };
  const closeCamera=()=>{
    setIsCameraOpen(false)
    setCapturedImage(null)
    setBase64Image(null);
    setShowmodal(false)
  }
  const showToast=(val)=>{
    Toast.show({
      type:'success',
      text1:"Data Retrieved successfully",
      visibilityTime:2500,
      autoHide:true,
     position:'bottom',
     //topOffset:110,
     bottomOffset:50
    })
  }
  const takePicture = async () => {
    if (cameraRef.current) {
      const { uri } = await cameraRef.current.takePictureAsync();
      setCapturedImage(uri);
      //convert image to base64 format
      convertToBase64(uri);
      setShowmodal(true)
    }
  };

  const convertToBase64 = async (imageUri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
     // console.log(base64);
      setBase(base64)
      setBase64Image(base64);
      // You can now use the base64 string as needed, e.g., send it to a server or display it in your app.
    } catch (error) {
      console.error('Error converting image to base64:', error);
    }
  };
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: true, // Request the base64 representation of the selected image.
      });

      if (!result.cancelled) {
        const { uri, base64 } = result;
        setCapturedImage(uri);
        setBase64Image(base64);
        setShowmodal(true)
        console.log('Selected Image URI:', uri);
        console.log('Selected Image as Base64:', base64);
        // You can now use the selected image's URI and base64 string as needed.
      }
    } catch (error) {
      console.error('Error picking an image from the gallery:', error);
    }
  };
  return (
    <LinearGradient 
    style={styles.container}
    colors={["#003153","#000000"]}
    start={{x:0.1,y:0.9}}
    end={{x:1,y:1}}
    >
    <View style={styles.container}>
      <View style={{marginTop:35}}>
    <HeaderRNE
      leftComponent={{
        icon: 'menu',
        color: '#fff',
      }}
     
      //style={styles.headerContainer}
      // rightComponent={
      //     <View style={styles.headerRight}>
           
      //       <TouchableOpacity
      //         style={{ marginLeft: 10 }}
      //         onPress={playgroundNavigate}
      //       >
      //         <Icon type="antdesign" name="rocket1" color="white" />
      //       </TouchableOpacity>
      //     </View>
      // }
      centerComponent={{text:'mistvyl', style: styles.heading }}
      // centerComponent={{
      //       // <Image
      //       //   source={require('./assets/Frame 504.jpg')} // Specify the path to your image
      //       // />,
      // }}
    />
    </View>
         
      <View style={styles.container}>
      {isCameraOpen ? (
        <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            {!capturedImage && 
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <Text style={styles.captureText}>Take Picture</Text>
            </TouchableOpacity> 
            }
            {capturedImage && (
              <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
            )}
            <TouchableOpacity style={styles.closeButton} onPress={closeCamera}>
              <Text style={styles.closeText}>Close Camera</Text>
            </TouchableOpacity>
            {capturedImage && !genereted &&(
            <TouchableOpacity
              style={styles.generateButton}
              disabled={genereted}
              onPress={() => {
                if (base64Image) {
                  console.log('Base64 Image:', base64Image);
                  console.log("recieved an image")
                 
                  // setCapturedImage(null)
                  setBase64Image(null)
                  setIsCameraOpen(false)
                  setGenerated(true)
                } else {
                  console.log('No image selected.');
                }
              }}
            >
              <Text style={styles.generateText}>Generate</Text>
            </TouchableOpacity>
          )}
          </View>
        </Camera>
      ) : (
        <View style={styles.cameraContainer}>
         <Toast/>
        
          <View style={styles.topButtonContainer}>
            <LinearGradient 
            style={styles.openButton}
            colors={["#87cefa","#1e90ff"]}
            //colors={["#89CFF0","#337CCF",]}
            start={{x:0.1,y:0.4}}
            end={{x:0.4,y:1}}
            >
          <TouchableOpacity 
           onPress={openCamera}
           smooth duration={200} 
           className="text-white items-center rounded-md bg-gradient-to-r from-cyan-500 to-blue-400"
           //style={styles.openButton}
           >
            {/* <Text style={styles.openText} >Open Camera</Text> */}
            <EvilIcons name="camera" size={38} color="white" />
          </TouchableOpacity>
          </LinearGradient>
          <LinearGradient 
            style={styles.openButton}
            colors={["#ff8c69","#fbab60"]}
            //colors={["#89CFF0","#337CCF",]}
            start={{x:0.1,y:0.5}}
            end={{x:0.2,y:1}}
            >
          <TouchableOpacity 
          //style={styles.uploadButton} 
          onPress={pickImage}>
            {/* <Text style={styles.uploadButtonText}>Upload</Text> */}
            <EvilIcons name="image" size={38} color="white" />
          </TouchableOpacity>
          </LinearGradient>
          {
            capturedImage && 
          <TouchableOpacity style={styles.crossButton} onPress={()=>{
            setGenerated(false)
            setCapturedImage(null)
            setResponse({})
            setLoader(true)
          }}>
            {/* <Text style={styles.uploadText}>Upload</Text> */}
            <EvilIcons name="close-o" size={38} color="white" />
          </TouchableOpacity>
          }
          </View>
          {/* {
            genereted && !loader &&
            <View>
            <Text style={styles.DisplayText}>
            {'\n'}
             VRN : {response.inferred_vrn?response.inferred_vrn:"not found"}
             {'\n'}
             VRN_confidence : {response.inferred_vrn_confidence?response.inferred_vrn_confidence:"not found"}
             </Text>
           </View>
          } */}
     
          <View style={{flex:1}}>
              <Modal
              transparent={true}
              visible={showmodal}
              animationType='slide'
              >
                 {/* <LinearGradient 
    style={{flex:1,justifyContent:'center',alignItems:'center'}}
    colors={["#003153","#000000"]}
    start={{x:0.1,y:0.9}}
    end={{x:1,y:1}}
    > */}
              <View 
              style={{flex:1,justifyContent:'center',alignItems:'center'}}
              >
                           <LinearGradient 
    style={{
      // backgroundColor:'black',
       padding:15,
       borderRadius:20,
       elevation:5,
       marginBottom:20,
      width:'95%'
    }}
    colors={["#003153","#000000"]}
    start={{x:0.1,y:0.9}}
    end={{x:1,y:1}}
    >
                <View 
                // style={{
                //   backgroundColor:'black',
                //    padding:15,
                //    borderRadius:20,
                //    elevation:5,
                //    marginBottom:20,
                //   width:'95%'
                // }}
                >

                { capturedImage &&
                <Image source={{ uri: `file://${capturedImage}` }} style={{
                  flex: 1,
                  //width: Dimensions.get('window').width, // Set image width to full screen width
                  padding:100,
                  marginBottom:20,
                  borderRadius:20,
                }} />
                 }
                 {
            genereted && !loader &&
            <View>
            <Text style={styles.DisplayText}>
            {'\n'}
             VRN : {response.inferred_vrn?response.inferred_vrn:"not found"}
             {'\n'}
             VRN_confidence : {response.inferred_vrn_confidence?response.inferred_vrn_confidence:"not found"}
             </Text>
           </View>
          } 
               <View style={{display:'flex',
    flexDirection: 'row',}}>
                <TouchableOpacity style={styles.generateButton} onPress={()=>{
                  setShowmodal(false)
                  setGenerated(false)
                  setCapturedImage(null)
                  setResponse({})
                  setLoader(true)
                }}> 
                  <Text style={{color:'white'}}>close</Text>
                </TouchableOpacity>
                 { !genereted &&
                <TouchableOpacity style={styles.generateButton}
                onPress={() => {
                  if (base64Image) {
                    console.log('Base64 Image:', base64Image);
                    console.log("Genaerate button after upload")
                    
                    
                    
                    
                    // setCapturedImage(null)
                    setBase64Image(null)
                    setGenerated(true)
                  } else {
                    console.log('No image selected.');
                    Alert.alert('No image selected')
                  }
                }}
                > 
                  <Text style={{color:'white'}}>generate</Text>
                </TouchableOpacity>
}
                </View>
                </View>
              </LinearGradient>
                
              </View>
              </Modal>
            </View>

          <View style={{marginTop:15}}>
            <Text style={styles.DisplayEmp}>
            {'\n'}
             {/* VRN : {response.inferred_vrn?response.inferred_vrn:"not found"} */}
             {'\n'}
             {/* VRN_confidence : {response.inferred_vrn_confidence?response.inferred_vrn_confidence:"not found"} */}
             </Text>
           </View>
          {console.log("this is captured image",capturedImage)}
           {/* {
                <Image source={{ uri: `file://${capturedImage}` }} style={styles.capturedImage} />
              } */}

          {/* {
            genereted && !loader &&
            <View>
            <Text style={styles.DisplayText}>
            {'\n'}
             VRN : {response.inferred_vrn?response.inferred_vrn:"not found"}
             {'\n'}
             VRN_confidence : {response.inferred_vrn_confidence?response.inferred_vrn_confidence:"not found"}
             </Text>
           </View>
          }  */}
             
          {/* {capturedImage && (
            <LinearGradient 
            style={styles.openButton}
            colors={["#008000","#006400"]}
            //colors={["#89CFF0","#337CCF",]}
            start={{x:0,y:0}}
            end={{x:1,y:1}}
            >
            <TouchableOpacity
             // style={styles.generateButton}
              onPress={() => {
                if (base64Image) {
                  console.log('Base64 Image:', base64Image);
                  console.log("Genaerate button after upload")
                  
                  axios.post('http://183.82.7.228:8080/latency-test', 
                  
                    {
                      "global_unique_id": "id-set-by-NETC",
                      "image_evidence": base64Image,
                      "image_timestamp": "2023-06-07T05:10:51Z",
                      "vrn": "AP28CL6517",
                      "vrn_confidence": "0.99",
                      "use_case": "parking",
                      "image_format": "png",
                      "callback_url": "http://localhost:8080/callback",
                      "test":"test"
                  }
                  )
                  .then(function (response) {
                    console.log("This Is tHeREsPose",response.data);
                    setResponse(response.data)
                    setLoader(false)
                    showToast("success")
                  })
                  .catch(function (error) {
                    console.log(error);
                    showToast("error")
                  });
                  // setCapturedImage(null)
                  setBase64Image(null)
                  setGenerated(true)
                } else {
                  console.log('No image selected.');
                  Alert.alert('No image selected')
                }
              }}
            >
              <Text style={styles.generateText}>Generate</Text>
            </TouchableOpacity>
            </LinearGradient>
          )} */}
        </View>
      )}
    </View>

    {/* this is the end for cam logic */}
      {/* <Text style={styles.title}>
        please select below to take a picture or upload through gallery
      </Text>
      <Button
        title="camera"
        onPress={() => Alert.alert('you will get the camera access')}
      /> */}
  
{/* <IconButton
    icon="upload"
    color={"blue"}
    size={20}
    onPress={() => 
      console.log('Pressed upoload')

    }
  /> */}
{/* <IconButton
    icon="camera"
    color={"blue"}
    size={20}
    onPress={() => 
      console.log('Pressed camera')
    }
  /> */}
    <Separator />
      {/* <StatusBar style="auto" /> */}
    </View>
     </LinearGradient>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "black", // Set background color to black for full screen effect
  },
  cameraContainer: {
    // flexDirection:'row',
    flex:4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: Dimensions.get('window').width, // Set camera width to full screen width
    //height:'80%'
   //width:'70%'
  },
  uploadButton: {
    backgroundColor: '#EA906C',
    color:'white',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    marginRight:20,
  },
  crossButton: {
    //backgroundColor: 'black',
    //color:'white',
    paddingTop:6,
    borderRadius: 35,
    marginTop: 20,
    marginLeft:"60%",
  },
  uploadText: {
    fontSize: 18,
    color: '#00FF00',
  },
  DisplayText: {
    fontSize: 18,
    color: '#F8F0E5',
    padding:10,
    paddingLeft:25,
  },
  DisplayEmp: {
   // fontSize: 18,
   // color: '#F8F0E5',
    padding:40,
    paddingLeft:25,
  },
  uploadButtonText: {
    fontSize: 18,
    color: 'white',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end', // Move buttons to the bottom
  },
  openButton: {
    //backgroundColor: '#337CCF',
    padding: 5,
    borderRadius: 15,
    marginTop: 20,
    marginRight:10,
  },
  openText: {
    fontSize: 18,
    fontWeight:10,
    color: 'white',
  },
  captureButton: {
    backgroundColor: '#183D3D',
    padding: 10,
    width:150,
    margin:15,
    marginBottom:0,
    borderRadius: 10,
    alignItems:'center',
  },
  captureText: {
    fontSize: 18,
    color: 'white',
  },
  capturedImage: {
    flex: 1,
    width: Dimensions.get('window').width, // Set image width to full screen width
    paddingTop:50,
    borderRadius:30,
  },
  generateButton: {
    backgroundColor: '#3D550C',
    width:130,
    margin:15,
    padding: 10,
    alignItems:'center',
    borderRadius: 10,
    marginTop: 20,
  },
  generateText: {
    fontSize: 18,
    color: 'white',
  },
  topButtonContainer: {
    display:'flex',
    flexDirection: 'row', // Arrange buttons horizontally
    //justifyContent: 'space-between', // Add space between buttons
    marginTop: 10,
    width:'100%',
    padding:10
    
  },
  closeButton: {
    backgroundColor: '#BB2525',
    width:150,
    padding: 10,
    margin:15,
    borderRadius: 10,
    alignItems:'center',
  },
  closeText: {
    fontSize: 18,
    color: 'white',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#397af8',
    marginBottom: 20,
    marginTop:20,
    width: '100%',
    paddingVertical: 15,
  },
  heading: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle:'italic'
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
  },
  subheaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
