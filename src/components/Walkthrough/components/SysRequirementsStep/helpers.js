import * as CONST from "./constants";

const MIN_OSX_VERSION = "11.2.3";
const MIN_WIN_VERSION = "";
const MIN_AND_VERSION = "";
const MIN_LIN_VERSION = "";

const MIN_FIR_VERSION = "";
const MIN_SAF_VERSION = "";
const MIN_CHR_VERSION = "89.0.4389.128";

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
    os = CONST.OS_macOS;
    version = getOSVersion();
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = CONST.OS_iOS;
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = CONST.OS_Windows;
  } else if (/Android/.test(userAgent)) {
    os = CONST.OS_Android;
  } else if (!os && /Linux/.test(platform)) {
    os = CONST.OS_Linux;
  }
  return { os, version };
};

const getFirefoxBrowser = () => {
  const regExp = /\bFirefox\/.*$/;
  browserVersion = regExp.exec(userAgent)[0];
  return {
    browserName: CONST.BR_Firefox,
    browserVersion: browserVersion.substr(8, browserVersion.length - 8),
  };
};
const getSafariBrowser = () => {
  const regExp = /\bVersion\/.*\s/;
  browserVersion = regExp.exec(userAgent)[0];
  return {
    browserName: CONST.BR_Safari,
    browserVersion: browserVersion.substr(8, browserVersion.length - 9),
  };
};
const getChromeBrowser = () => {
  const regExp = /\bChrome\/.*\s/;
  browserVersion = regExp.exec(userAgent)[0];
  return {
    browserName: CONST.BR_Chrome,
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

//const validateVersion = ( userVersion, reqVersion ) => reqVersion.split('.').merge( userVersion.split('.') )
const validateVersion = (userVersion, reqVersion) =>
  reqVersion.split(".").reduce((pv, cv, i) => cv <= userVersion.split(".")[i]);

const isOSSupported = (os, version) => {
  switch (os) {
    case CONST.OS_macOS:
      return validateVersion(version, MIN_OSX_VERSION);
    case CONST.OS_Windows:
      return validateVersion(version, MIN_WIN_VERSION);
    case CONST.OS_Android:
      return validateVersion(version, MIN_AND_VERSION);
    case CONST.OS_Linux:
      return validateVersion(version, MIN_LIN_VERSION);
    default:
      return false;
  }
};

const isBrowserSupported = (browser, version) => {
  switch (browser) {
    case CONST.BR_Firefox:
      return validateVersion(version, MIN_FIR_VERSION);
    case CONST.BR_Safari:
      return validateVersion(version, MIN_SAF_VERSION);
    case CONST.BR_Chrome:
      return validateVersion(version, MIN_CHR_VERSION);
    default:
      return false;
  }
};

export { getOS, getBrowser, isOSSupported, isBrowserSupported };
