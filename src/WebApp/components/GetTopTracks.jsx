import React, {memo, useEffect, useState } from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import $ from 'jquery';

const TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks";

const GetTopTracks = ({ redirectDefault }) => {
  const [token, setToken] = useState("");
  const [timeRange, setTimeRange] = useState("long_term");
  const [firstTimeClicked, setFirstTimeClicked] = useState(true);
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      // console.log("Token retrieved from localStorage:", storedToken);
      setToken(storedToken);
    } else {
      console.log("No token found in localStorage.");
    }
  }, []);

  const handleGetTopTracks = () => {
    setFirstTimeClicked(false);
  };

  useEffect(() => {
    if (!firstTimeClicked && token) {
      const tracksEndpointWithTimeRange = `${TRACKS_ENDPOINT}?time_range=${timeRange}&limit=5`;
  
      const fetchTopTracks = async () => {
        try {
          const response = await axios.get(tracksEndpointWithTimeRange, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
          });
          setTopTracks(response.data.items || []);
        } catch (error) {
          console.error("Error fetching top tracks:", error);
          redirectDefault();
        }
      };
  
      fetchTopTracks();
    }
  }, [firstTimeClicked, timeRange, token, redirectDefault]);

  const handleTimeRangeChange = (newTimeRange) => {
    setTimeRange(newTimeRange);
    $('#charttracks .covertop').fadeOut(200);
    $('#charttracks .covertop').fadeIn(1000);
    $('#resultstracks .coverbottom img').fadeOut(200);
    $('#resultstracks .coverbottom img').fadeIn(1000);
  };

  return (
    <>
      <ButtonGroup id="gettracksbtn">
        <Button variant="outline-dark" size="lg" onClick={handleGetTopTracks}>Get Top Tracks</Button>{' '}
      </ButtonGroup>
      {!firstTimeClicked && (
        <ButtonGroup id="timerangetracks" className="data">
          <Button variant="outline-dark" size="lg" onClick={() => handleTimeRangeChange("short_term")}>Last month</Button>{' '}
          <Button variant="outline-dark" size="lg" onClick={() => handleTimeRangeChange("medium_term")}>Last 6 months</Button>{' '}
          <Button variant="outline-dark" size="lg" onClick={() => handleTimeRangeChange("long_term")}>Overall</Button>{' '}
        </ButtonGroup>
      )}

      <div id="charttracks" className="data" style={{display: 'none'}}>
        <p className="titlechart">Your top tracks</p>
        {topTracks.map((tracks, index) => (
          <>
            <div id={`chart${index}`} key={index}>
              {tracks.album.images && tracks.album.images.length > 0 && (
                <div className="covertop">
                  <img 
                    src={tracks.album.images[0].url}
                    alt="Track"
                  />
                </div>
              )}
              <p className="count">{index + 1}.</p>
            </div>
          </>
          ))}
      </div>

      <div id="resultstracks" className="data">
        {topTracks.map((tracks, index) => (
          <div id="elements" key={index}>
            <a href={tracks.external_urls.spotify} target="_blank" rel="noreferrer">
              <div>
                <p>Track:<br /><b>"{tracks.name}"</b></p>
                <br />
                {tracks.album.images && tracks.album.images.length > 0 && (
                  <div className="coverbottom">
                    <img 
                      src={tracks.album.images[0].url}
                      alt="Track"
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

export default memo(GetTopTracks);
