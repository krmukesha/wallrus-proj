import React, { useState, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import TopbarView from "./view";
import styles from "./styles";
import { withRouter } from "react-router-dom";
import Menu from "../../config/Menu";

const Topbar = (props) => {
  const [value, setvalue] = useState(0);
  const [menuDrawer, setmenuDrawer] = useState(false);

  const { classes } = props;

  const handleChange = (value) => {
    setvalue({ value });
  };

  const mobileMenuOpen = () => {
    setmenuDrawer({ menuDrawer: true });
  };

  const mobileMenuClose = () => {
    setmenuDrawer({ menuDrawer: false });
  };

  useLayoutEffect(() => {
    window &&
      Object.prototype.hasOwnProperty.call(window, "scrollTo") &&
      typeof window.scrollTo === "function" &&
      window.scrollTo(0, 0);
  }, []);

  const current = () => {
    if (props.currentPath === "/home") {
      return 0;
    }
    // if (this.props.currentPath === "/dashboard") {
    //   return 1;
    // }
    if (props.currentPath === "/signup") {
      return 1;
    }
    if (props.currentPath === "/articles") {
      return 2;
    }
    if (props.currentPath === "/walkthrough") {
      return 3;
    }
  };

  return (
    <TopbarView
      classes={classes}
      noTabs={props.noTabs}
      menuItems={Menu}
      handleChange={handleChange}
      mobileMenuOpen={mobileMenuOpen}
      mobileMenuClose={mobileMenuClose}
      current={current}
      value={value}
      menuDrawer={menuDrawer}
      search={props.location.search}
    />
  );
};

Topbar.propTypes = {
  noTabs: PropTypes.bool,
  classes: PropTypes.object,
  location: PropTypes.object,
  currentPath: PropTypes.string,
};

export default withRouter(withStyles(styles)(Topbar));
