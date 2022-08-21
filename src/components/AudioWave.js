import React, {useState} from "react";
import ReactWaves from "@dschoon/react-waves";

const AudioWave = (props) => {
    const [playing, setPlaying] = useState(false);

    return (<div className={"container example"}>
            <div
                onClick={() => {
                    setPlaying(!playing)
                }}
            >
                {!playing ? "▶" : "■"}
            </div>
            <ReactWaves
                audioFile={props.audio}
                className={"react-waves"}
                options={{
                    barHeight: 1,
                    cursorWidth: 0,
                    height: 200,
                    hideScrollbar: true,
                    progressColor: "#EC407A",
                    responsive: true,
                    waveColor: "#D1D6DA",
                }}
                volume={1}
                zoom={1}
                playing={playing}
            />
        </div>);
}

export default AudioWave;
