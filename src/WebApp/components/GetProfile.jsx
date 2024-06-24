import React, {memo, useEffect, useState } from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const PROFILE_ENDPOINT = "https://api.spotify.com/v1/me";

const GetProfile = ({ redirectDefault }) => {
  const [token, setToken] = useState("");
  const [data, setData] = useState({});
  const [firstTimeClicked, setFirstTimeClicked] = useState(true);
  
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      // console.log("Token retrieved from localStorage:", storedToken);
      setToken(storedToken);
    } else {
      console.log("No token found in localStorage.");
    }
  }, []);

  const handleGetProfile = () => {
    setFirstTimeClicked(false);
  };

  useEffect(() => {
    if (!firstTimeClicked && token) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(PROFILE_ENDPOINT, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
          });
          setData(response.data || []);
        } catch (error) {
          console.error("Error fetching top artists:", error);
          redirectDefault();
        }
      };

      fetchProfile();
    }
}, [firstTimeClicked, token, redirectDefault]);

  return (
    <>
      <ButtonGroup id="getprofilebtn">
        <Button variant="outline-dark" size="lg" onClick={handleGetProfile}>Get Profile</Button>{' '}
      </ButtonGroup>
      
      <div id="resultsprofile" className="data" style={{display: 'none'}}>
        {data.display_name && <p>Name: <b>{data.display_name}</b></p>}
        {data.country && <p>Country: <b>{data.country}</b></p>}
        {data.followers && <p>Followers: <b>{data.followers.total}</b></p>}
        {data.product && <p>Product: <b>{data.product}</b></p>}
        {data.images && data.images.length > 0 && (
          <div className="profileimage">
            <p>Profile Image:</p>
            <img id="cover"
              src={data.images[1].url}
              alt="Profile"
              style={{ width: "100px", height: "100px" }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default memo(GetProfile);
