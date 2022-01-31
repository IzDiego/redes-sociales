/* eslint-disable react-hooks/rules-of-hooks */
import useFacebook from "./hooks/useFacebook";
import { useState } from "react";
import { Button, Grid, TextField, Box } from "@mui/material";

export const logintest = () => {
  loginprint('hola mundo');
};

const loginprint = (text) => {
  const options = { appId: "1384611055331878" };
  const { isFacebookSDKReady } = useFacebook(options);
  console.log('loginprint');
  console.log(text);
  FB.login(checkLoginState(), {
    scope: "email, instagram_content_publish, pages_manage_posts",
  });
};

export function Facebook({ myLink, myMensaje }) {
  const [sesion, setSesion] = useState(false);
  const [conexion, setConexion] = useState("primary");
  const [info, setInfo] = useState(myLink);
  const [link, setLink] = useState(myMensaje);
  const [mensaje, setMensaje] = useState("");
  const options = { appId: "1384611055331878" };
  const { isFacebookSDKReady } = useFacebook(options);

  function checkLoginState() {
    FB.getLoginStatus(
      function (response) {
        statusChangeCallback(response);
      }.bind(this)
    );
  }
  async function getAllInfo() {
    const allInfo = [];
    var pageToken;
    var pageId;

    const token = getAccessToken();

    await fetch(`https://graph.facebook.com/v12.0/me?access_token=${token}`)
      .then((response) => response.json())
      .then((data) => {
        allInfo.push(data);
      });

    await fetch(
      `https://graph.facebook.com/v12.0/me/accounts?access_token=${token}`
    )
      .then((response) => response.json())
      .then((data) => {
        pageToken = data.data[0]["access_token"];
        pageId = data.data[0]["id"];
        allInfo.push(data);
      });

    await fetch(
      `https://graph.facebook.com/v12.0/${pageId}?fields=instagram_business_account&access_token=${pageToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        allInfo.push(data);
      });

    /* allInfo.forEach((element) => {
      console.log(element);
    }); */
    return allInfo;
  }

  function postIgFbPhoto() {
    const imgLink = link;
    const body = mensaje;
    const pageId = info[1].data[0].id;
    const pageToken = info[1].data[0].access_token;
    const igId = info[2].instagram_business_account.id;
    const token = getAccessToken();

    console.log(igId);
    console.log(pageId);
    console.log(pageToken);

    FB.api(
      `/${pageId}/photos`,
      "post",
      {
        url: imgLink,
        message: body,
        access_token: pageToken,
      },
      function (response) {
        console.log("response", response);
        if (!response || response.error) {
          alert("Ocurrió un error al publicar en Facebook");
          console.log("error");
        } else {
          alert("Publicado exitosamente en Facebook");
          console.log("publicado exitosamente en Facebook");
          console.log(response.id);
        }
      }
    );
    FB.api(
      `/${igId}/media`,
      "POST",
      { image_url: imgLink, caption: body, access_token: token },
      function (response) {
        console.log(response.id);
        const creation_id = response.id;
        FB.api(
          `/${igId}/media_publish`,
          "POST",
          { creation_id: creation_id },
          function (response) {
            if (!response || response.error) {
              alert("Ocurrió un error al publicar en Instagram");
              console.log("error");
            } else {
              alert("Publicado exitosamente en Instagram");
              console.log("publicado exitosamente en Instagram");
              console.log(response.id);
            }
          }
        );
      }
    );
  }

  function getAccessToken() {
    var accessToken;
    FB.getLoginStatus(function (response) {
      if (response.status === "connected") {
        accessToken = response.authResponse.accessToken;
      }
    });
    return accessToken;
  }

  function login() {
    FB.login(checkLoginState(), {
      scope: "email, instagram_content_publish, pages_manage_posts",
    });
  }

  function statusChangeCallback(response) {
    if (response.status === "connected") {
      setSesion(true);
      console.log("ya has iniciado sesión");
    } else if (response.status === "not_authorized") {
      console.log(
        "[FacebookLoginButton] Iniciaste sesión en Facebook pero la aplicacion no tiene permisos"
      );
    } else {
      setSesion(false);
      console.log("[FacebookLoginButton] No has iniciaste sesión en Facebook");
    }
  }

  function logOutFb() {
    FB.logout(function (response) {
      console.log("Has cerrado sesión con exito");
      setSesion(false);
    });
  }
  function MyToken() {
    console.log(getAccessToken());
  }

  async function sendHandler(e) {
    e.preventDefault();
    reloadInfo();
    if (link && mensaje) {
      console.log("link: ", link, "mensaje: ", mensaje);
      postIgFbPhoto();
    }
  }

  const Sesion = () => {
    if (sesion === false) {
      return (
        <>
          <Button variant="contained" onClick={login}>
            Iniciar Sesión
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button color="error" variant="contained" onClick={logOutFb}>
            Cerrar Sesión
          </Button>
        </>
      );
    }
  };

  async function reloadInfo() {
    if (typeof info === "undefined") {
      setInfo(await getAllInfo());
      alert("Error al conectar, vuelve a intentarlo");
      setConexion("error");
    } else {
      alert("Conexión exitosa");
      setConexion("success");
    }
    console.log(info);
  }

  if (isFacebookSDKReady === true) {
    return (
      { logintest },
      (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} />
            <Grid item xs={8}></Grid>
            <Grid item xs={4}>
              <Sesion />
            </Grid>
            <Grid item xs={8}></Grid>
            <Grid item xs={4}>
              <Button color={conexion} variant="contained" onClick={reloadInfo}>
                Conectar mis páginas
              </Button>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={7}>
              <Box
                component="form"
                xs={7}
                noValidate
                autoComplete="off"
                onSubmit={sendHandler}
              >
                <TextField
                  id="texto-link"
                  label="Link"
                  variant="outlined"
                  value={link}
                  margin="normal"
                  fullWidth
                  required
                  onChange={(e) => {
                    setLink(e.target.value);
                  }}
                />
                <TextField
                  id="texto-mensaje"
                  label="Mensaje"
                  variant="outlined"
                  value={mensaje}
                  margin="normal"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  onChange={(e) => {
                    setMensaje(e.target.value);
                  }}
                />
                <Button fullWidth variant="contained" type="submit">
                  Publicar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </>
      )
    );
  } else {
    return { logintest }, (<h1>Cargando...</h1>);
  }
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
