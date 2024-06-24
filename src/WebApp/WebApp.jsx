import { useCallback, useEffect, useState } from 'react';
import axios from "axios";
import GetProfile from './components/GetProfile';
import GetTopArtists from './components/GetTopArtists';
import GetTopTracks from './components/GetTopTracks';
import GetTopGenres from './components/GetTopGenres';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import './WebApp.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Cookies from 'js-cookie'

const CLIENT_ID = "";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/";
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
];
const SCOPES_URL_PARAM = SCOPES.join('%20');

const getAuthParams = (hash) => {
  const stringAfterHashtag = hash.substring(1);
  const paramsInUrl = stringAfterHashtag.split("&");
  const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
    const [key, value] = currentValue.split("=");
    accumulater[key] = value;
    return accumulater;
  }, {});
  return paramsSplitUp;
};

const WebApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const getLastUpdateTimestamp = () => {
    const lastUpdateTimestamp = Cookies.get('lastUpdate');
    if (lastUpdateTimestamp) {
      return new Date(parseInt(lastUpdateTimestamp));
    }
    return null;
  };

  useEffect(() => {
    setLastUpdate(getLastUpdateTimestamp());
  }, []);

  const redirectDefault = useCallback(() => {
    axios.get("https://api.spotify.com/v1")
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else {
        console.log('Error', error.message);
      }
      console.log(error.config);
      setIsLoggedIn(false);
    });
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const { access_token, expires_in, token_type } = getAuthParams(window.location.hash);

      if (access_token && expires_in && token_type) {
        localStorage.clear();
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("tokenType", token_type);
        localStorage.setItem("expiresIn", expires_in);

        setIsLoggedIn(true);
      } else {
        console.error("Incomplete authentication parameters received.");
        setIsLoggedIn(false);
      }
    } else {
      const accessToken = localStorage.getItem("accessToken");
      setIsLoggedIn(accessToken !== null);
    }
  }, []);

  useEffect(() => {
    var profileShown = false;
    var artistsShown = false;
    var tracksShown = false;
    var genresShown = false;

    $('#resultsprofile').hide();
    $('#charttracks').hide();
    $('#chartartists').hide();
    $('#chartgenres').hide();

    $(document).on('click', '#getprofilebtn', function() {
      if (!profileShown) {
        $('.data').hide();
        $('#resultsprofile').fadeIn("fast");
        profileShown = true;
        artistsShown = false;
        tracksShown = false;
        genresShown = false;
      }
    });

    $(document).on('click', '#getartistsbtn', function() {
      if (!artistsShown) {
        $('.data').hide();
        $('#resultsartists').fadeIn("fast");
        $('#chartartists').fadeIn("fast");
        $('#timerangeartists').show();
        artistsShown = true;
        profileShown = false;
        tracksShown = false;
        genresShown = false;
      }
    });

    $(document).on('click', '#gettracksbtn', function() {
      if (!tracksShown) {
        $('.data').hide();
        $('#resultstracks').fadeIn("fast");
        $('#charttracks').fadeIn("fast");
        $('#timerangetracks').show();
        tracksShown = true;
        profileShown = false;
        artistsShown = false;
        genresShown = false;
      }
    });

    $(document).on('click', '#getgenresbtn', function() {
      if (!genresShown) {
        $('.data').hide();
        $('#resultsgenres').fadeIn("fast");
        $('#chartgenres').fadeIn("fast");
        $('#timerangegenres').show();
        genresShown = true;
        tracksShown = false;
        profileShown = false;
        artistsShown = false;
      }
    });
  }, []);

  const handleLogin = () => {
    const currentTimestamp = new Date().getTime();
    Cookies.set('lastUpdate', currentTimestamp);
    setLastUpdate(new Date(currentTimestamp));
    const AuthURL = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
    window.location = AuthURL;
  };

  return (
    <>
      <header>
        <p>pullsify</p>
      </header>
      <main>
        {isLoggedIn ? (
          <>
            <GetProfile isLoggedIn={isLoggedIn} redirectDefault={redirectDefault} />
            <GetTopArtists isLoggedIn={isLoggedIn} redirectDefault={redirectDefault} />
            <GetTopTracks isLoggedIn={isLoggedIn} redirectDefault={redirectDefault} />
            <GetTopGenres isLoggedIn={isLoggedIn} redirectDefault={redirectDefault} />
          </>
        ) : (
          <ButtonGroup id="loginbtn">
            <Button variant="outline-dark" size="lg" onClick={handleLogin}>Login to Spotify</Button>
          </ButtonGroup>
        )}
      </main>
      <footer>
      <p>Last site update: {lastUpdate ? lastUpdate.toLocaleString() : 'Never'}</p>
      </footer>
    </>
  );
};

export default WebApp;
