import React, {memo, useEffect, useState } from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import $ from 'jquery';

const GENRES_ENDPOINT = "https://api.spotify.com/v1/me/top/artists";

const GetTopGenres = ({ redirectDefault }) => {
  const [token, setToken] = useState("");
  const [timeRange, setTimeRange] = useState("long_term");
  const [firstTimeClicked, setFirstTimeClicked] = useState(true);
  const [topGenres, setTopGenres] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      // console.log("Token retrieved from localStorage:", storedToken);
      setToken(storedToken);
    } else {
      console.log("No token found in localStorage.");
    }
  }, []);

  const handleGetTopGenres = () => {
    setFirstTimeClicked(false);
  };

  useEffect(() => {
    if (!firstTimeClicked && token) {
      const genresEndpointWithTimeRange = `${GENRES_ENDPOINT}?time_range=${timeRange}&limit=50`;

      const fetchTopGenres = async () => {
        try {
          const response = await axios.get(genresEndpointWithTimeRange, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
          });
            const genres = response.data.items.flatMap(artist => artist.genres);
            const genreCounts = genres.reduce((acc, genre) => {
            acc[genre] = (acc[genre] || 0) + 1;
            return acc;
            }, {});

            const genreArray = Object.entries(genreCounts).map(([genre, count]) => ({ genre, count }));
            genreArray.sort((a, b) => b.count - a.count);
            setTopGenres(genreArray.slice(0, 20));
        } catch (error) {
          console.error("Error fetching top genres:", error);
          redirectDefault();
        }
      };

      fetchTopGenres();
    }
  }, [firstTimeClicked, timeRange, token, redirectDefault]);

  const handleTimeRangeChange = (newTimeRange) => {
    setTimeRange(newTimeRange);
    $('.genretop').fadeOut(200);
    $('.genretop').fadeIn(1000);
  };

  return (
    <>
      <ButtonGroup id="getgenresbtn">
        <Button variant="outline-dark" size="lg" onClick={handleGetTopGenres}>Get Top Genres</Button>{' '}
      </ButtonGroup>
      {!firstTimeClicked && (
        <ButtonGroup id="timerangegenres" className="data">
          <Button variant="outline-dark" size="lg" onClick={() => handleTimeRangeChange("short_term")}>Last month</Button>{' '}
          <Button variant="outline-dark" size="lg" onClick={() => handleTimeRangeChange("medium_term")}>Last 6 months</Button>{' '}
          <Button variant="outline-dark" size="lg" onClick={() => handleTimeRangeChange("long_term")}>Overall</Button>{' '}
        </ButtonGroup>
      )}
      
      <div id="chartgenres" className="data" style={{display: 'none'}}>
        <p className="titlechart">Your top genres</p>
        {topGenres.map((genre, index) => (
          <>
            <p className="genretop">{index + 1}.{genre.genre} ({genre.count})</p>
          </>
          ))}
      </div>
    </>
  );
};

export default memo(GetTopGenres);
