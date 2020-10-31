import React, { Fragment, useState, useEffect } from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react'
import {
  Button
} from 'reactstrap';
import CIcon from '@coreui/icons-react'
import { Link, Redirect } from 'react-router-dom';
import { logout  } from '../actions/auth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const TheHeaderDropdown = ({isAuthenticated, logout}) => {
  /* Hanlde Automatic Logout */
  const [user, setUser] = useState("");
  if(!isAuthenticated){
    return <Redirect to="/login"/>
  }
  const logoutHandler = () =>{
    logout();
  }

  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CIcon
            name="cil-user"
            className="c-avatar-img"
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem onClick={logoutHandler}>
          <CIcon name="cil-lock-locked" className="mfe-2" /> 
            Log out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

TheHeaderDropdown.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { logout } )(TheHeaderDropdown);