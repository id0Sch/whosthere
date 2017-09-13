/* global process,gapi,fetch */
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactGoogleAuth from 'react-google-auth'

import { getLocalIP } from '../utils/localip'
import Header from '../components/Header'

import Toggle from 'material-ui/Toggle'
import Paper from 'material-ui/Paper'
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card'
import { ListItem } from 'material-ui/List'
import FlatButton from 'material-ui/FlatButton'

const getDisplayName = (firstName, lastName) => ['schachter'].includes(lastName.toLowerCase()) ? lastName : firstName

function Loader (props) {
  return <div>Loading...</div>
}

class App extends Component {
  constructor (props) {
    super(props)
    try {
      const profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile()
      const firstName = profile.getGivenName()
      const lastName = profile.getFamilyName()
      this.state = {
        user: {
          id: profile.getId(),
          name: profile.getName(),
          displayName: getDisplayName(firstName, lastName),
          firstName: firstName,
          lastName: lastName,
          imageUrl: profile.getImageUrl(),
          email: profile.getEmail()
        },
        showUnpairedOnly: true
      }
    } catch (err) {
      this.state = {err}
    }
  }

  componentWillMount () {
    Promise.all([
      fetch(process.env.BACKEND_URL).then(data => data.json()),
      getLocalIP()
    ])
      .then(([data, ip]) => {
        this.setState({addresses: data, user: Object.assign(this.state.user, {ip})})
      })
  }

  onUnpairedToggle () {
    this.setState({showUnpairedOnly: !this.state.showUnpairedOnly})
  }

  onPairClicked (user, addr) {
    console.log({
      mac_address: addr.mac_address,
      email: user.email
    })
  }

  render () {
    const {onSignOutClick} = this.props
    const {user, showUnpairedOnly, addresses = []} = this.state

    let paired = 0
    const addressesList = addresses.map(addr => {
      //style={{color: addr.last_seen_ip_address === user.ip ? 'red' : 'black'}}
      const owner = addr.email !== 'None' ? addr.email : null
      owner && paired++
      if (owner && showUnpairedOnly) {
        return null
      }
      return <Card style={{width: '35%', marginRight: '20px', marginTop: '20px'}} key={addr.mac_address}>
        <CardHeader
          title={`${addr.mac_address} - ${addr.last_seen_ip_address}`}
          subtitle={!!owner ? `paired with ${owner}` : null}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <p>Seen {addr.occurences} times</p>
          <p>Last seen : {addr.last_seen_timestamp}</p>
        </CardText>
        {
          !owner &&
          <CardActions>
            <FlatButton label="Pair" onClick={() => this.onPairClicked(user, addr)}/>
          </CardActions>
        }
      </Card>
    })
    return (
      <div>
        <Header title={`Hey ${user.displayName} your local ip is: ${user.ip}`} icon={user.imageUrl}
                onSignOutClick={onSignOutClick}/>
        <ListItem primaryText={`Unpaired devices only (${paired} devices)`} style={{width: '250px'}}
                  rightToggle={<Toggle toggled={showUnpairedOnly} onToggle={this.onUnpairedToggle.bind(this)}/>}/>
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
          {addressesList}
        </div>
      </div>
    )
  }
}

function SignIn (props) {
  if (props.initializing) {
    return <div>Initializing...</div>
  }
  if (props.error) {
    console.log('Error', props.error)
    return <div>Error!</div>
  }
  const content = props.signingIn ? <div>Signing in...</div> : <button onClick={props.onSignInClick}>Sign in</button>
  return <div>
    {content}
  </div>
}

App.contextTypes = {
  muiTheme: PropTypes.object
}
export default ReactGoogleAuth({
  clientId: process.env.AUTH_CLIENT_ID,
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  scope: 'https://www.googleapis.com/auth/spreadsheets',
  loader: Loader,
  signIn: SignIn
})(App)
