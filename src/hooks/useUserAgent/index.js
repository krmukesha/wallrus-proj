import "../../helpers/userAgentPolyfill_helper";

const useUserAgent = () => {
  return {
    os: (window.UAData.OS && window.UAData.OS) || "Unknown",
    browser: (window.UAData.Browser && window.UAData.Browser) || "Unknown",
  };
};
export default useUserAgent;
