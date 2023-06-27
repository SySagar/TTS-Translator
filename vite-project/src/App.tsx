import { CircularProgress, IconButton, Stack } from "@mui/material";
import { Typography } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import "./App.css";

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
    if (buttonState) audio.play();
    if (!buttonState) audio.pause();

    setButtonState(!buttonState);
  };

  const translateText = async () => {
    const data = {
      q: text,
      source: "es",
      target: "hi",
    };

    setLoading(true);
    await axios
      .post(`https://libretranslate.de/translate`, data)
      .then(async (response) => {
        setTranslatedText(response.data.translatedText);
        setTranslatedText((state) => {
          console.log(state);
          handleAudio(state);
          return state;
        });
      });
  };

  const handleAudio = async (state: string) => {
    console.log(translatedText);
    await axios
      .post("http://localhost:5000/speech", {
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
