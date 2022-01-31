import { useEffect, useState } from "react";

const useFacebook = function ({ appId }) {
  const [isFacebookSDKReady, setFacebookSDKReady] = useState(false);
  const version = "v12.0";
  const autoLogAppEvents = true;
  const xfbml = true;
  const debug = false;
  const lang = "es_LA";
  useEffect(() => {
    window.fbAsyncInit = function () {
      FB.init({
        appId,
        autoLogAppEvents,
        xfbml,
        version,
      });

      setFacebookSDKReady(true);
    };

    (function (d, s, id) {
      if (d.getElementById(id)) {
        setFacebookSDKReady(true);
        return;
      }

      const fjs = d.getElementsByTagName(s)[0];
      const js = d.createElement(s);
      js.id = id;
      js.src = `https://connect.facebook.net/${lang}/sdk${
        debug ? "/debug" : ""
      }.js`;
      js.async = 1;
      js.defer = 1;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  return { isFacebookSDKReady };
};

export default useFacebook;
