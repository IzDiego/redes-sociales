/* eslint-disable react-hooks/rules-of-hooks */
import useFacebook from "./hooks/useFacebook";
import React from "react";
import { useState } from "react";

export default function FacebookLogin() {
  const [info, setInfo] = useState();
  const options = { appId: process.env.FACEBOOK_APP_ID };
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
    const imgLink ="https://i.imgur.com/LVa970E.jpg";
    const body ="Mi segunda imagen en instagram y facebook #FBJSSDK #vacasentada";
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
          alert("Error occured");
          console.log("error")
        } else {
          alert("Post ID: " + response.id);
          console.log("publicado exitosamente, con el ID:");
          console.log(response.id);
        }
      }
    );
    FB.api(
      `/${igId}/media`,
      'POST',
      { image_url: imgLink,
        caption: body,
        access_token: token},
      function(response) {
        console.log(response.id);
        const creation_id = response.id;
        FB.api(
          `/${igId}/media_publish`,
          'POST',
          {"creation_id":creation_id},
          function(response) {
            console.log(response);
            console.log("Publicado en instagram exitosamente")
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

  function MyToken() {
    FB.api(`/me`);
    console.log(getAccessToken());
  }

  function login() {
    FB.login(checkLoginState(), {
      scope: "email, instagram_content_publish, pages_manage_posts",
    });
  }

  function statusChangeCallback(response) {
    if (response.status === "connected") {
      /*       this.testAPI();
       */
      console.log("conectado");
    } else if (response.status === "not_authorized") {
      console.log(
        "[FacebookLoginButton] Iniciaste sesión en Facebook pero la aplicacion no tiene permisos"
      );
    } else {
      console.log("[FacebookLoginButton] No has iniciaste sesión en Facebook");
    }
  }

  function postToFbPage() {
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
  }

  function logOutFb() {
    FB.logout(function (response) {
      console.log("Has cerrado sesión con exito");
    });
  }

  async function reloadInfo(){
    setInfo(await getAllInfo());
    console.log(info);
  };

  if (isFacebookSDKReady === true) {
  

    return (
      <>
        <button disabled={!isFacebookSDKReady} onClick={() => login()}>
          Connect with Facebook
        </button>
        <button onClick={() => getAccessToken()}>Token</button>
        <button onClick={() => MyToken()}>Dime mi token</button>
        <button onClick={() => reloadInfo()}>Cargar info</button>
        <button onClick={() => postToFbPage()}>Publicar</button>
        <button onClick={() => postImgToFbPage()}>Publicar Imagen</button>
        <button onClick={() => postIgFbPhoto()}>
          Publicar Imagen en facebook e instagram
        </button>
        <button onClick={() => logOutFb()}>salir</button>
      </>
    );
  } else {
    return <h1>Cargando...</h1>;
  }
}
