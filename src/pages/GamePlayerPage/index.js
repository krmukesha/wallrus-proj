import React from "react";
import GamePlayerPageView from "./view";
import GamePlayerUI from "../../components/GamePlayerUI";

const GamePlayerPage = () => {
  if (!process.env.REACT_APP_SBS_URL || !process.env.REACT_APP_MIS_URL)
    throw console.error(
      "REACT_APP_SBS_URL and REACT_APP_MIS_URL env variables must be specified in the designated .env environment",
    );
  const sbsWSEndpoint = `${process.env.REACT_APP_SBS_URL}${
    process.env.REACT_APP_SBS_PORT &&
    process.env.REACT_APP_SBS_PORT !== "" &&
    `:${parseInt(process.env.REACT_APP_SBS_PORT, 10)}`
  }`;
  const misWSEndpoint = `${process.env.REACT_APP_MIS_URL}${
    process.env.REACT_APP_MIS_PORT &&
    process.env.REACT_APP_MIS_PORT !== "" &&
    `:${parseInt(process.env.REACT_APP_MIS_PORT, 10)}`
  }`;
  return (
    <GamePlayerPageView>
      <GamePlayerUI
        sbsWSEndpoint={sbsWSEndpoint}
        misWSEndpoint={misWSEndpoint}
        // sbsWSEndpoint={`wss://m01.lvsdm.xyz:443`} //https://m01.lvsdm.xyz:8401/
        // Public remote server
        // sbsWSEndpoint={`wss://lvsdm-01.orangerine-dev.com:8011/`}
        // misWSEndpoint={`wss://lvsdm.ca/remote`}
        debugLevel={1}
        autoplay={true}
        // //  Bunker
        // sbsWSEndpoint={`wss://m01.lvsdm.xyz`}
        // misWSEndpoint={`wss://mis.lvsdm.xyz/remote`}
      />
    </GamePlayerPageView>
  );
};

export default GamePlayerPage;
