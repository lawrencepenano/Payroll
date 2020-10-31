import React, { Fragment, useState } from 'react'
import { Link, Redirect } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Form,
  InputGroup,
  InputGroupAddon,
  Spinner,
  Container
} from "reactstrap";
import CIcon from '@coreui/icons-react'
import { connect } from 'react-redux';
import { setAlert } from '../../../actions/alert';
import { login } from '../../../actions/auth';
import PropTypes from 'prop-types';

const Login = ({setAlert, login, isAuthenticated }) => {
  const { control, handleSubmit, register, errors, reset, getValues, setValue } = useForm();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const { email, password } = formData;

  const onChange = e => setFormData({...formData, [e.target.name]:e.target.value});

  const onSubmit = async e => {
      if(!email){
          setAlert('Email/User Name is required!', 'danger')
          return
      }
      if(!password){
          setAlert('Password is required!', 'danger')
          return
      }
        login({email, password})
  }

  if(isAuthenticated){
      return <Redirect to='/dashbord'/>
    }



  return (
    <Fragment>
      <section className="login">
        <div className="dark-overlay">
          <div className="landing-inner">
                <Container>
                  <Row className="justify-content-center">
                    <Col md="9" lg="7" xl="6">
                      <Card className="mx-4 mt-5">
                        <CardBody className="p-4">
                        <Form onSubmit={handleSubmit(onSubmit)}>
                             <h1 style={{color:"black"}}>Login</h1>
                             <p className="text-muted">Sign In to your account</p>
                            <InputGroup className="mb-3">
                              <CInputGroupPrepend>
                                <CInputGroupText>
                                    <i className="fa fa-envelope"></i>
                                </CInputGroupText>
                              </CInputGroupPrepend>
                                <Input
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="Email / Username"
                                    ref={register({required: "Required"})}
                                    value={formData.email}
                                    onChange={onChange}
                                />
                                  {errors.email && (
                                    <FormFeedback>Email is Required!</FormFeedback>
                                  )}
                            </InputGroup>
                            <InputGroup className="mb-3">
                              <CInputGroupPrepend>
                                <CInputGroupText>
                                  <CIcon name="cil-lock-locked" />
                                </CInputGroupText>
                              </CInputGroupPrepend>
                                <Input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    ref={register({required: "Required"})}
                                    onChange={onChange}
                                    value={formData.password}
                                />
                                  {errors.password && (
                                    <FormFeedback>Password is Required!</FormFeedback>
                                  )}
                            </InputGroup>
                            <Button type="submit" color="success" block>Log in</Button>
                            <p className="d-flex text-dark justify-content-center my-2">
                              Don't have an account? <Link to="/register">Register</Link>
                            </p>
                          </Form>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Container>
              </div>
        </div>
        </section>
    </Fragment>
  )
}
Login.propTypes = {
  setAlert: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})



export default connect(mapStateToProps, { setAlert, login } )(Login);
