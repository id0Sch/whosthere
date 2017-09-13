import React from 'react'
import { render } from 'react-dom'

import injectTapEventPlugin from 'react-tap-event-plugin'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import App from './js/containers/App'
import './css/style.scss'

injectTapEventPlugin()

const muiTheme = getMuiTheme({
  appBar: {
    height: 48
  }
})

render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <App/>
  </MuiThemeProvider>
  ,
  document.getElementById('root')
)
