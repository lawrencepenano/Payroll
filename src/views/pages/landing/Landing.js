import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
      <Fragment>
        {/* <nav className="navbar bg-dark">
            <h1>
            <span style={{color:"red"}}></span>SMP Payroll
            </h1>
        </nav> */}
        <section className="landing">
        <div className="dark-overlay">
          <div className="landing-inner">
            <h1 className="x-large"> <span style={{color:"red"}}>SMP</span> <span style={{color:"white"}}>PAYROLL</span></h1>
            <p className="lead">
                Make your payroll processing simpler, faster and more accurate <br/>
                with these effective online payroll service solution. 
            </p>
            <div className="buttons">
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
              <Link to="/login" className="btn btn-light">Login</Link>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
    )
}

export default Landing;
