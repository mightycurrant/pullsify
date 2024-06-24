import React, {memo, useEffect, useState } from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import $ from 'jquery';

const ARTISTS_ENDPOINT = "https://api.spotify.com/v1/me/top/artists";

const GetTopArtists = ({ redirectDefault }) => {
  const [token, setToken] = useState("");
  const [timeRange, setTimeRange] = useState("long_term");
  const [firstTimeClicked, setFirstTimeClicked] = useState(true);
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      // console.log("Token retrieved from localStorage:", storedToken);
      setToken(storedToken);
    } else {
      console.log("No token found in localStorage.");
    }
  }, []);

  const handleGetTopArtists = () => {
    setFirstTimeClicked(false);
  };

  useEffect(() => {
    if (!firstTimeClicked && token) {
      const artistsEndpointWithTimeRange = `${ARTISTS_ENDPOINT}?time_range=${timeRange}&limit=5`;

      const fetchTopArtists = async () => {
        try {
          const response = await axios.get(artistsEndpointWithTimeRange, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
          });
          setTopArtists(response.data.items || []);
        } catch (error) {
          console.error("Error fetching top artists:", error);
          redirectDefault();
        }
      };

      fetchTopArtists();
    }
  }, [firstTimeClicked, timeRange, token, redirectDefault]);

  const handleTimeRangeChange = (newTimeRange) => {
    setTimeRange(newTimeRange);
    $('#chartartists .covertop').fadeOut(200);
    $('#chartartists .covertop').fadeIn(1000);
    $('#resultsartists .coverbottom img').fadeOut(200);
    $('#resultsartists .coverbottom img').fadeIn(1000);
  };

  return (
    <>
      <ButtonGroup id="getartistsbtn">
        <Button variant="outline-dark" size="lg" onClick={handleGetTopArtists}>Get Top Artists</Button>{' '}
      </ButtonGroup>
      {!firstTimeClicked && (
        <ButtonGroup id="timerangeartists" className="data">
          <Button variant="outline-dark" size="lg" onClick={() => handleTimeRangeChange("short_term")}>Last month</Button>{' '}
          <Button variant="outline-dark" size="lg" onClick={() => handleTimeRangeChange("medium_term")}>Last 6 months</Button>{' '}
          <Button variant="outline-dark" size="lg" onClick={() => handleTimeRangeChange("long_term")}>Overall</Button>{' '}
        </ButtonGroup>
      )}
      
      <div id="chartartists" className="data" style={{display: 'none'}}>
        <p className="titlechart">Your top artists</p>
        {topArtists.map((artist, index) => (
          <>
            <div id={`chart${index}`} key={index}>
              {artist.images && artist.images.length > 0 && (
                <div className="covertop">
                  <img 
                    src={artist.images[0].url}
                    alt="Artist"
                  />
                </div>
              )}
              <p className="count">{index + 1}.</p>
            </div>
          </>
          ))}
      </div>

      <div id="resultsartists" className="data">
        {topArtists.map((artist, index) => (
          <div id="elements" key={index}>
            <a href={artist.external_urls.spotify} target="_blank" rel="noreferrer">
              <div>
                <p>Artist:<br /><b>"{artist.name}"</b></p>
                <br />
                {artist.images && artist.images.length > 0 && (
                  <div className="coverbottom">
                    <img 
                      src={artist.images[0].url}
                      alt="Artist"
                    />
                  </div>
                )}
              </div>
            </a>
          </div>
        ))}
      </div>
    </>
  );
};

export default memo(GetTopArtists);
