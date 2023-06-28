import { CircularProgress, IconButton, Stack } from "@mui/material";
import { Typography } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import "./App.css";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

function App() {
  const [text, setText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [playButton, setPlayButton] = useState<boolean>(false);
  const [audioFile, setAudioFile] = useState<any>("");
  const [buttonState, setButtonState] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const handleTextChange = (e: any) => {
    setText(e.target.value);
  };

  const playAudio = () => {
    const audio = new Audio(`data:audio/mp3;base64,${audioFile}`);
    setButtonState(!buttonState);

    if (buttonState){
      audio.play();
      } 
      else
      {audio.pause();
      }
   
  };
  
  // useEffect(() => {

  // }, [audio, buttonState]);

  const translateText = async () => {

    if(text === ""){
      setPlayButton(false);
      toast.error("Please enter some text")
      return
    }
    else
    {

      setPlayButton(false);
      setButtonState(true);

      const encodedParams = new URLSearchParams();
encodedParams.set('q', text);
encodedParams.set('target', 'hi');
encodedParams.set('source', 'en');

const options = {
  method: 'POST',
  url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'Accept-Encoding': 'application/gzip',
    'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
    'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
  },
  data: encodedParams,
};

try {
	await axios.request(options).then(async(response)=>{

    setTranslatedText(response.data.data.translations[0].translatedText);
    setTranslatedText((state) => {
      console.log(state);
      handleAudio(state);
      return state;
    });
  })
} catch (error) {
	console.error(error);
}

    setLoading(true);
    // await axios
    //   .post(`https://libretranslate.de/translate`, data)
    //   .then(async (response) => {
       
    //   });

    }
    };

  const handleAudio = async (state: string) => {
    console.log(translatedText);
    await axios
      .post("https://tts-translator-backend.onrender.com/speech", {
        text: state,
      })
      .then((res) => {
        console.log(res.data);
        setPlayButton(true);
        setLoading(false);
        setAudioFile(res.data);
      });
  };

  return (
    <div className="App">
      <Stack
        width={"100%"}
        minHeight={"100vh"}
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          background: "#c0c0c0",
        }}
      >
        <Toaster position="top-center"></Toaster>
        <Stack
          border={2}
          borderRadius="8px"
          borderColor="divider"
          gap={3}
          minWidth={"400px"}
          maxWidth={"400px"}
          padding={5}
        >
          <Typography variant="h6">Input your English text here</Typography>

          <TextField
            sx={{ color: "#000" }}
            fullWidth
            label="Enter here"
            onChange={handleTextChange}
            id="fullWidth"
            required
          />

          <Button
            className="translate"
            variant="contained"
            onClick={translateText}
            sx={{
              background: "#000",
              marginTop: "2rem",
              "&:hover": {
                backgroundColor: "#110d0d",
              },
            }}
            disableElevation
          >
            Translate to hindi
          </Button>
        </Stack>

        {playButton && (
          <IconButton
            aria-label="delete"
            onClick={playAudio}
            sx={{
              color: "purple",
              marginTop: "2rem",
            }}
          >
            {buttonState && (
              <PlayCircleFilledWhiteIcon
                sx={{
                  fontSize: "4rem",
                }}
              />
            )}
            {!buttonState && (
              <PauseCircleIcon
                sx={{
                  fontSize: "4rem",
                }}
              />
            )}
          </IconButton>
        )}
        {loading && 
        <CircularProgress  sx={{
          color: "purple",
          marginTop: "2rem",
        }}/>}
      </Stack>
    </div>
  );
}

export default App;
