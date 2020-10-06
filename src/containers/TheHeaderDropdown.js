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
import { Link } from 'react-router-dom';
import { logout  } from '../actions/auth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const TheHeaderDropdown = ({ logout }) => {
  /* Hanlde Automatic Logout */
  const [user, setUser] = useState("");

    useEffect(()=>{
        if(localStorage.getItem('user')){
            let current_user = JSON.parse(localStorage.getItem('user'));
            setUser(current_user.name);
        }
    },[])

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
  logout: PropTypes.func.isRequired,
}
export default connect(null, { logout } )(TheHeaderDropdown);