import useAuth from "../hooks/useAuth";
import axios from "axios";
import { Container, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import TrackSearchResult from "../TrackSearchResult/TrackSearchResult";
import Player from "../Player/Player";
import Spinner from "../Spinner/Spinner";
const credentials = {
  clientId: "8e41ff9be89a43649e15e39a4592f019",
};
const spotifyApi = new SpotifyWebApi(credentials);
const Dashboard = ({ code }) => {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [lyrics, setLyrics] = useState("");

  const inputChangeHandler = (e) => setSearch(e.target.value);
  const chooseTrack = (track) => {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  };
  useEffect(() => {
    if (!playingTrack) return;
    setIsLoading(true);
    const options = {
      params: {
        track: playingTrack.title,
        artist: playingTrack.artist,
      },
    };
    axios.get("http://localhost:3001/lyrics", options).then((res) => {
      setLyrics(res.data.lyrics);
      setIsLoading(false);
    });
  }, [playingTrack]);
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);
  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    if (cancel) return;
    spotifyApi.searchTracks(search).then((res) => {
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            }
          );
          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });
    return () => (cancel = true);
  }, [search, accessToken]);
  const tracks = searchResults.map((track) => (
    <TrackSearchResult
      track={track}
      key={track.uri}
      chooseTrack={chooseTrack}
    />
  ));
  const fetchedLyrics = searchResults.length === 0 && (
    <div className="text-center" style={{ whiteSpace: "pre", color: "white" }}>
      {isLoading ? <Spinner /> : lyrics}
    </div>
  );
  return (
    <Container
      className="d-flex flex-column py-2"
      style={{
        height: "100vh",
      }}
    >
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={inputChangeHandler}
        style={{
          backgroundColor: "#1db954",
          borderColor: "#1db954",
          borderRadius: "30px",
          color: "white",
        }}
      />
      <div className="flex-grow-1 my-2 dashboard" style={{ overflowY: "auto" }}>
        {tracks}
        {fetchedLyrics}
      </div>
      <div>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
  );
};

export default Dashboard;
