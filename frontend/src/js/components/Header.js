import React from 'react'
import PropTypes from 'prop-types'

import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

const Header = (props) => {
  return <AppBar
    title={props.title}
    showMenuIconButton={false}
    iconElementRight={
      <IconMenu
        iconButtonElement={
          <Avatar src={props.icon}/>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem onClick={props.onSignOutClick} primaryText='Sign out'/>
      </IconMenu>
    }/>
}

Header.propTypes = {
  icon: PropTypes.string,
  onSignOutClick: PropTypes.func
}
export default Header
