(function () {
  /* Polyfill for the useragent object */

  let userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    vendor = window.navigator.vendor,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"];

  const setValueOnWindowUAObject = (key, val) => (window.UAData[key] = val);

  const getOSVersion = (os) => {
    let start, end;
    switch (os) {
      case "macOS":
        end = userAgent.indexOf(")");
        start = userAgent.substr(0, end).lastIndexOf(" ") + 1;
        return userAgent.substr(start, end - start).replaceAll("_", ".");
      case "iOS":
        break;
      case "Windows":
        break;
      case "Android":
        break;
      case "Linux":
        break;
      default:
        return "Unknown";
    }
  };

  const setOS = () => {
    let os;
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = "macOS";
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = "iOS";
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = "Windows";
    } else if (/Android/.test(userAgent)) {
      os = "Android";
    } else if (!os && /Linux/.test(platform)) {
      os = "Linux";
    } else {
      os = "Unknown";
    }
    setValueOnWindowUAObject(
      "OS",
      os === "Unknown"
        ? "Unknown"
        : {
            name: os,
            version: getOSVersion(os),
          },
    );
  };

  const setBrowser = () => {
    let regExp, browserVersion, browser;
    if (!userAgent)
      setValueOnWindowUAObject("Browser", {
        name: "Unknown",
        version: "Unknown",
      });
    switch (vendor) {
      case "":
      case undefined:
        //  Firefox
        regExp = /\bFirefox\/.*$/;
        browserVersion = regExp.exec(userAgent)[0];
        browser = {
          name: "Firefox",
          version: browserVersion.substr(8, browserVersion.length - 8),
        };
        break;
      case "Apple Computer, Inc.":
        //  Safari
        regExp = /\bVersion\/.*\s/;
        browserVersion =
          (regExp.exec(userAgent) && regExp.exec(userAgent)[0]) || "Unkown";
        browser = {
          name: "Safari",
          version: browserVersion.substr(8, browserVersion.length - 9),
        };
        break;
      case "Google Inc.":
        //  Chrome
        regExp = /\bChrome\/.*\s/;
        browserVersion = regExp.exec(userAgent)[0];
        browser = {
          name: "Chrome",
          version: browserVersion.substr(7, browserVersion.length - 8),
        };
        break;
      default:
        //  Unkown
        browser = {
          name: "Unknown",
          version: "Unknown",
        };
    }
    setValueOnWindowUAObject("Browser", browser);
  };

  window.UAData = {
    OS: null,
    Browser: null,
  };
  setOS();
  setBrowser();
})();
