//  Must go on top
import styles from "../../components/theme/styles";
import WelcomePageView from "./view";

import React, { useState } from "react";
import withStyles from "@material-ui/styles/withStyles";
import { withRouter } from "react-router-dom";

import { InstructionDialog, SwipeDialog } from "../../components/dialogs";

// class WelcomePage extends Component {
const WelcomePage = () => {
  const [learnMoredialog, setlearnMoredialog] = useState(false);
  const [getStartedDialog, setgetStartedDialog] = useState(false);

  const openDialog = () => setlearnMoredialog(true);

  const dialogClose = () => setlearnMoredialog(false);

  const openGetStartedDialog = () => setgetStartedDialog(true);

  const closeGetStartedDialog = () => setgetStartedDialog(false);

  return (
    <WelcomePageView
      openDialog={openDialog}
      openGetStartedDialog={openGetStartedDialog}
    >
      <SwipeDialog open={learnMoredialog} onClose={dialogClose} />
      <InstructionDialog
        open={getStartedDialog}
        onClose={closeGetStartedDialog}
      />
    </WelcomePageView>
  );
};

export default withRouter(withStyles(styles)(WelcomePage));
