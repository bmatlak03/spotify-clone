import { useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
const Player = ({ accessToken, trackUri }) => {
  const [play, setPlay] = useState(false);
  useEffect(() => setPlay(true), [trackUri]);
  if (!accessToken) return null;
  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={(state) => {
        if (!state.isPlaying) setPlay(false);
      }}
      play={play}
      initialVolume={0.5}
      magnifySliderOnHover={true}
      uris={trackUri ? [trackUri] : []}
      styles={{
        activeColor: "#fff",
        bgColor: "#333",
        color: "#1db954",
        loaderColor: "#fff",
        sliderColor: "#1cb954",
        trackArtistColor: "#ccc",
        trackNameColor: "#fff",
      }}
    />
  );
};

export default Player;
