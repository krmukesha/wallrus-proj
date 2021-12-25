let userAgent = window.navigator.userAgent,
  platform = window.navigator.platform,
  vendor = window.navigator.vendor,
  macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
  windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
  iosPlatforms = ["iPhone", "iPad", "iPod"],
  os = null,
  version = null;

let browserVersion = null;

const getOSVersion = () => {
  const end = userAgent.indexOf(")");
  const start = userAgent.substr(0, end).lastIndexOf(" ") + 1;
  return userAgent.substr(start, end - start).replaceAll("_", ".");
};

const getOS = () => {
  if (macosPlatforms.indexOf(platform) !== -1) {
    os = "macOS";
    version = getOSVersion();
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = "iOS";
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = "Windows";
  } else if (/Android/.test(userAgent)) {
    os = "Android";
  } else if (!os && /Linux/.test(platform)) {
    os = "Linux";
  }
  return { os, version };
};

const getFirefoxBrowser = () => {
  const regExp = /\bFirefox\/.*$/;
  browserVersion = regExp.exec(userAgent)[0];
  return {
    browserName: "Firefox",
    browserVersion: browserVersion.substr(8, browserVersion.length - 8),
  };
};
const getSafariBrowser = () => {
  const regExp = /\bVersion\/.*\s/;
  browserVersion = regExp.exec(userAgent)[0];
  return {
    browserName: "Safari",
    browserVersion: browserVersion.substr(8, browserVersion.length - 9),
  };
};
const getChromeBrowser = () => {
  const regExp = /\bChrome\/.*\s/;
  browserVersion = regExp.exec(userAgent)[0];
  return {
    browserName: "Chrome",
    browserVersion: browserVersion.substr(7, browserVersion.length - 8),
  };
};
const getNonCompatibleBrowser = () => ({
  browserName: "Non Compatible",
  browserVersion: "--",
});

const getBrowser = () => {
  switch (vendor) {
    case "":
    case undefined:
      return getFirefoxBrowser();
    case "Apple Computer, Inc.":
      return getSafariBrowser();
    case "Google Inc.":
      return getChromeBrowser();
    default:
      return getNonCompatibleBrowser();
  }
};

export { getOS, getBrowser };
