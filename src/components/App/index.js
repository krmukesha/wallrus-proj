import React, { Component } from "react";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import "./App.css";
import Routes from "../../routes";
import { blue, grey, indigo, red } from "@material-ui/core/colors";

import GlobalContext from "../../contexts";

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: blue[900],
    },
    primary: {
      main: indigo[700],
      error: red[700],
      info: grey[900],
    },
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: ['"Lato"', "sans-serif"].join(","),
  },
});

class App extends Component {
  render() {
    return (
      <div>
        <GlobalContext>
          <ThemeProvider theme={theme}>
            <Routes />
          </ThemeProvider>
        </GlobalContext>
      </div>
    );
  }
}

export default App;
