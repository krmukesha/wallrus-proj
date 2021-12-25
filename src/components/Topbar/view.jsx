import React from "react";
import PropTypes from "prop-types";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { Link as MaterialLink } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import logo from "../theme/images/logo.svg";
// const logo = require("../theme/images/logo.svg");

const TopbarView = ({
  classes,
  handleChange,
  mobileMenuOpen,
  mobileMenuClose,
  current,
  noTabs,
  menuItems,
  menuDrawer,
  value,
  search,
}) => (
  <AppBar position="absolute" color="default" className={classes.appBar}>
    <Toolbar>
      <Grid container spacing={10} alignItems="baseline">
        <Grid item xs={12} className={classes.flex}>
          <div className={classes.inline}>
            <Typography variant="h6" color="inherit" noWrap>
              <Link to="/" className={classes.link}>
                <img width={20} src={logo} alt="" />
                <span className={classes.tagline}>Orangerine</span>
              </Link>
            </Typography>
          </div>
          {!noTabs && (
            <>
              <div className={classes.productLogo}>
                <Typography>Demo Application</Typography>
              </div>
              <div className={classes.iconContainer}>
                <IconButton
                  onClick={mobileMenuOpen}
                  className={classes.iconButton}
                  color="inherit"
                  aria-label="Menu"
                >
                  <MenuIcon />
                </IconButton>
              </div>
              <div className={classes.tabContainer}>
                <SwipeableDrawer
                  anchor="right"
                  open={menuDrawer}
                  onClose={mobileMenuClose}
                  onOpen={mobileMenuOpen}
                >
                  <AppBar title="Menu" />
                  <List>
                    {menuItems.map((item) => (
                      <ListItem
                        component={item.external ? MaterialLink : Link}
                        href={item.external ? item.pathname : null}
                        to={
                          item.external
                            ? null
                            : {
                                pathname: item.pathname,
                                search: search,
                              }
                        }
                        button
                        key={item.label}
                      >
                        <ListItemText primary={item.label} />
                      </ListItem>
                    ))}
                  </List>
                </SwipeableDrawer>
                <Tabs
                  value={current() || value}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={(e, v) => handleChange(v)}
                >
                  {menuItems.map((item, index) => (
                    <Tab
                      key={index}
                      component={item.external ? MaterialLink : Link}
                      href={item.external ? item.pathname : null}
                      to={
                        item.external
                          ? null
                          : {
                              pathname: item.pathname,
                              search: search,
                            }
                      }
                      classes={{ root: classes.tabItem }}
                      label={item.label}
                    />
                  ))}
                </Tabs>
              </div>
            </>
          )}
        </Grid>
      </Grid>
    </Toolbar>
  </AppBar>
);

TopbarView.propTypes = {
  classes: PropTypes.object,
  handleChange: PropTypes.func,
  mobileMenuOpen: PropTypes.func,
  mobileMenuClose: PropTypes.func,
  current: PropTypes.func,
  noTabs: PropTypes.bool,
  menuItems: PropTypes.array,
  menuDrawer: PropTypes.bool,
  value: PropTypes.number,
  search: PropTypes.string,
};

export default TopbarView;
