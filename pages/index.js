/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { useState } from "react";
import { logintest } from "./facebook";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";

export default function Home() {
  const [link, setLink] = useState("");
  const [mensaje, setMensaje] = useState("");
  const sendHandler = (e) => {
    e.preventDefault();
    if (link && mensaje) {
      console.log("link: ", link, "mensaje: ", mensaje);
      Facebook(link, mensaje);
    }
  };

  const clickHandler = () => {
    console.log('click')
    logintest();
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
        onSubmit={sendHandler}
      >
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              id="texto-link"
              label="Link"
              variant="outlined"
              value={link}
              required
              onChange={(e) => {
                setLink(e.target.value);
              }}
            />
          </Grid>

          <TextField
            id="texto-mensaje"
            label="Mensaje"
            variant="outlined"
            value={mensaje}
            required
            multiline
            rows={4}
            onChange={(e) => {
              setMensaje(e.target.value);
            }}
          />
          <Button variant="contained" type="submit">
            Publicar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              clickHandler();
            }}
          >
            Login
          </Button>
        </Grid>
      </Box>
    </>
  );
}

/* function postToFbPage() {
    var body = "Reading JS SDK documentation";
    FB.getLoginStatus(function (response) {
      console.log("login status", response);
      if (!(response.status === "connected")) {
        console.log("Ya iniciaste sesión");
      } else {
        const uID = response.authResponse.userID;
        const accessToken = response.authResponse.accessToken;
        console.log("accesstoken::", response.authResponse.accessToken);
        FB.api(
          "/me",
          { fields: "name" },
          { access_token: accessToken },
          function (response) {
            console.log(response);
          }
        );
        //get list of pages
        if (accessToken != null) {
          FB.api(
            "/me/accounts",
            "get",
            { access_token: accessToken },
            function (response) {
              console.log("resp of pages", response);
              if (response != null) {
                var data = response.data;
                const pageAccessToken = data[0].access_token;
                console.log("pageResponse:", response);
                console.log("pageAccessToken:", pageAccessToken);

                FB.api(
                  "/100382695866090/feed",
                  "post",
                  { message: body, access_token: pageAccessToken },
                  function (response) {
                    console.log("response", response);
                    if (!response || response.error) {
                      alert("Error occured");
                    } else {
                      alert("Post ID: " + response.id);
                    }
                  }
                );
              }
            }
          );
        }
      }
    });
  }

  function postImgToFbPage() {
    const imgLink = "https://v4.mui.com/static/logo.png";
    var body = "First IMG from js sdk";
    FB.getLoginStatus(function (response) {
      console.log("login status", response);
      if (!(response.status === "connected")) {
        console.log("Ya iniciaste sesión");
      } else {
        const uID = response.authResponse.userID;
        const accessToken = response.authResponse.accessToken;
        console.log("accesstoken:", response.authResponse.accessToken);
        FB.api(
          "/me",
          { fields: "name" },
          { access_token: accessToken },
          function (response) {
            console.log(response);
          }
        );
        //get list of pages
        if (accessToken != null) {
          FB.api(
            "/me/accounts",
            "get",
            { access_token: accessToken },
            function (response) {
              console.log("resp of pages", response);
              if (response != null) {
                var data = response.data;
                const pageAccessToken = data[0].access_token;
                console.log("pageAccessToken:", pageAccessToken);

                FB.api(
                  "/100382695866090/photos",
                  "post",
                  {
                    url: imgLink,
                    message: body,
                    access_token: pageAccessToken,
                  },
                  function (response) {
                    console.log("response", response);
                    if (!response || response.error) {
                      alert("Error occured");
                    } else {
                      alert("Post ID: " + response.id);
                    }
                  }
                );
                FB.api("/17841400114180322");
              }
            }
          );
        }
      }
    });
  } */
