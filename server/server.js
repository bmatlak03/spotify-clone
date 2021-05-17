require("dotenv").config();
const express = require("express");
const port = 3001;
const cors = require("cors");
const { getLyrics } = require("genius-lyrics-api");
const ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN;

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });

  spotifyApi.refreshAccessToken().then(
    (data) => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      });

      spotifyApi.setAccessToken(data.body["access_token"]);
    },
    (err) => {
      "Could not refresh access token", err;
    }
  );
});

app.post("/login", (req, res) => {
  const code = req.body.code;

  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      res.sendStatus(400);
    });
});

app.get("/lyrics", async (req, res) => {
  const options = {
    apiKey: ACCESS_TOKEN,
    title: req.query.track,
    artist: req.query.artist,
    optimizeQuery: true,
  };
  getLyrics(options).then((lyrics) => {
    const errMessage = "No lyrics found 😕";
    if (!lyrics) {
      lyrics = errMessage;
    }
    res.json({ lyrics });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
