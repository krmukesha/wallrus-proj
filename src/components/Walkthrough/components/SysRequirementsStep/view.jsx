import React from "react";
import PropTypes from "prop-types";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import UXButton from "../../../theme/components/UXButton";

// TODO : Save for later
// import AndroidIcon from '@material-ui/icons/Android';
// import ImageIcon from '@material-ui/icons/Image';
// import WorkIcon from '@material-ui/icons/Work';
// import BeachAccessIcon from '@material-ui/icons/BeachAccess';

import AppleIcon from "@material-ui/icons/Apple";
import WebIcon from "@material-ui/icons/Web";
// import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import NetworkCheckIcon from "@material-ui/icons/NetworkCheck";

import PublishIcon from "@material-ui/icons/Publish";
import GetAppIcon from "@material-ui/icons/GetApp";
import WifiTetheringIcon from "@material-ui/icons/WifiTethering";
import SettingsEthernetIcon from "@material-ui/icons/SettingsEthernet";

import * as TEST_STATES from "./constants/testStates";

const RecommendationsDetailView = ({ recommendation }) => (
  <>
    <Typography variant="subtitle2" style={{ fontWeight: "bold" }} gutterBottom>
      {`${recommendation.label}`}{" "}
    </Typography>
    {recommendation.text}
  </>
);
RecommendationsDetailView.propTypes = {
  recommendation: PropTypes.object,
};

const SpeedTestDataView = ({ data }) => (
  <>
    {data.pingStatus && (
      <>
        <SettingsEthernetIcon /> {`${data.pingStatus}`}{" "}
      </>
    )}
    {data.jitterStatus && (
      <>
        <WifiTetheringIcon />
        {`${data.jitterStatus}`}{" "}
      </>
    )}
    {data.dlStatus && (
      <>
        <GetAppIcon />
        {`${data.dlStatus}`}{" "}
      </>
    )}
    {data.ulStatus && (
      <>
        <PublishIcon />
        {`${data.ulStatus}`}{" "}
      </>
    )}
  </>
);
SpeedTestDataView.propTypes = {
  data: PropTypes.object,
};

const SpeedTestView = ({ classes, data }) => (
  <>
    <ListItemAvatar>
      <Avatar className={classes.warning}>
        <NetworkCheckIcon />
      </Avatar>
    </ListItemAvatar>

    <ListItemText
      style={{ color: "#fff" }}
      primary="Internet Connection"
      secondary={<SpeedTestDataView data={data} />}
    />
  </>
);
SpeedTestView.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.object,
};

const RequirementsListView = ({
  classes,
  os,
  version,
  browserName,
  browserVersion,
  speedTestData,
}) => (
  <List className={classes.requirementsList}>
    <ListItem>
      <ListItemAvatar>
        <Avatar className={classes.success}>
          <AppleIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        style={{ color: "#fff" }}
        primary="Operative System"
        secondary={`${os} ${version}`}
      />
    </ListItem>
    <ListItem>
      <ListItemAvatar>
        <Avatar className={classes.success}>
          <WebIcon />
        </Avatar>
      </ListItemAvatar>
      {/* <ListItemText primary="Internet Browser" secondary="Chrome Blink 91 for iOS" /> */}
      <ListItemText
        primary="Internet Browser"
        style={{ color: "#fff" }}
        secondary={`${browserName} ${browserVersion}`}
      />
    </ListItem>

    <ListItem>
      <SpeedTestView
        style={{ color: "#fff" }}
        classes={classes}
        data={speedTestData}
      />
    </ListItem>
  </List>
);
RequirementsListView.propTypes = {
  classes: PropTypes.object,
  os: PropTypes.string,
  version: PropTypes.object,
  browserName: PropTypes.object,
  browserVersion: PropTypes.object,
  speedTestData: PropTypes.object,
};

const RunningView = ({
  classes,
  os,
  version,
  browserName,
  browserVersion,
  speedTestData,
}) => (
  <>
    <Typography variant="body1" style={{ color: "#fff" }} gutterBottom>
      Test has started. Please wait
    </Typography>
    <RequirementsListView
      classes={classes}
      os={os}
      version={version}
      browserName={browserName}
      browserVersion={browserVersion}
      speedTestData={speedTestData}
    />
  </>
);
RunningView.propTypes = {
  classes: PropTypes.object,
  os: PropTypes.string,
  version: PropTypes.object,
  browserName: PropTypes.object,
  browserVersion: PropTypes.object,
  speedTestData: PropTypes.object,
};

const PromptView = ({ classes, onClickCallback }) => (
  <>
    <Typography
      variant="body1"
      style={{
        color: "#fff",
        fontFamily: "CircularAir-Light",
        padding: "10px",
        fontSize: "1rem",
      }}
      gutterBottom={true}
    >
      {`Please wait while we validate your device's capabilities.`}
    </Typography>
    <UXButton
      onClick={() => onClickCallback()}
      size="large"
      className={`${classes.actionButtom} ${classes.startTestButton} ${classes.startbtn}`}
    >
      Start Test
    </UXButton>
    {/* <Button
      className={`${classes.actionButtom} ${classes.startTestButton}`}
      variant="contained"
      color="primary"
      onClick={() => onClickCallback()}
      size="large"
      fullWidth
    >
      Start Test
    </Button> */}
  </>
);
PromptView.propTypes = {
  classes: PropTypes.object,
  onClickCallback: PropTypes.func,
};

const SysRequirementsStepView = ({
  classes,
  os,
  version,
  browserName,
  browserVersion,
  speedTestData,
  recommendations,
  startTestCallback,
  state,
}) => (
  <div className={classes.bigContainer}>
    <Paper className={classes.paper}>
      <div className={classes.topInfo}>
        <Container maxWidth="sm" disableGutters={true}>
          <Typography
            variant="subtitle1"
            style={{
              textTransform: "upperCase",
              fontWeight: "bold",
              color: "#fff",
              fontSize: "1.5rem",
              fontFamily: "Imperator",
            }}
            gutterBottom
          >
            System Requirements Checkup
          </Typography>
          <div className="line"></div>
          {state === TEST_STATES.PROMPT && (
            <PromptView classes={classes} onClickCallback={startTestCallback} />
          )}
          {state === TEST_STATES.RUNNING && (
            <RunningView
              classes={classes}
              os={os}
              version={version}
              browserName={browserName}
              browserVersion={browserVersion}
              speedTestData={speedTestData}
            />
          )}
        </Container>
      </div>
      {state === TEST_STATES.DONE && recommendations.length > 0 && (
        <div className={classes.middleInfo}>
          <Typography
            variant="subtitle1"
            style={{ fontWeight: "bold" }}
            gutterBottom
          >
            Recommendations
          </Typography>
          {recommendations &&
            recommendations.map((r, i) => (
              <RecommendationsDetailView key={i} recommendation={r} />
            ))}
        </div>
      )}
    </Paper>
  </div>
);

SysRequirementsStepView.propTypes = {
  classes: PropTypes.object,
  os: PropTypes.string,
  version: PropTypes.string,
  browserName: PropTypes.string,
  browserVersion: PropTypes.string,
  speedTestData: PropTypes.object,
  recommendations: PropTypes.array,
  startTestCallback: PropTypes.func,
  state: PropTypes.string,
};

export default SysRequirementsStepView;
