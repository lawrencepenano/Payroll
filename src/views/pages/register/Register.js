import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom';
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
import { register } from '../../../actions/auth';
import PropTypes from 'prop-types';

const Register = ({setAlert, register}) => {
  const { control, handleSubmit, errors } = useForm();
  const [formData, setFormData] = useState({
    company_name: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: '',
    phone: '',
  })

  const onChange = e => setFormData({...formData, [e.target.name]:e.target.value});
  const onSubmit = async new_data => {
    const { company_name, first_name, last_name , email, phone,  password , password2 } = new_data;
      if(password !== password2){
          setAlert('Password do not match', 'danger')
      }else {
          register({company_name, first_name, last_name , email, phone,  password })
      }
  }

  if(localStorage.getItem('user')){
      window.location.replace("/blogs")
    }

  return (
    <Fragment>
      <section className="register">
        <div className="dark-overlay">
          <div className="landing-inner">
                <Container>
                  <Row className="justify-content-center">
                    <Col md="9" lg="7" xl="6">
                      <Card className="mx-4">
                        <CardBody className="p-4">
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <h1 style={{color:"black"}}>Register</h1>
                            <p className="text-muted">Create your account</p>
                            <InputGroup className="mb-3">
                              <CInputGroupPrepend>
                                <CInputGroupText>
                                    <i className="fa fa-university"></i>
                                </CInputGroupText>
                              </CInputGroupPrepend>
                                <Controller
                                    as={Input}
                                    type="text"
                                    id="company_name"
                                    name="company_name"
                                    placeholder="Business Name"
                                    control={control}
                                    rules={{ required: true }}
                                    invalid={errors.company_name ? true : false}
                                    value={formData.company_name}
                                    defaultValue={formData.company_name}
                                    onChange={onchange}
                                />
                                  {errors.company_name && (
                                    <FormFeedback>Company Name is Required!</FormFeedback>
                                  )}
                            </InputGroup>
                            <InputGroup className="mb-3">
                              <CInputGroupPrepend>
                                <CInputGroupText>
                                    <i className="fa fa-envelope"></i>
                                </CInputGroupText>
                              </CInputGroupPrepend>
                                <Controller
                                    as={Input}
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    control={control}
                                    rules={{ 
                                      required: true, 
                                      pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                    }}
                                    invalid={errors.email ? true : false}
                                    value={formData.email}
                                    defaultValue={formData.email}
                                    onChange={onchange}
                                />
                                  {errors.email && errors.email.type == "required" && (<FormFeedback>Address 1 is Required!</FormFeedback>)}
                                  {errors.email && errors.email.type == "pattern" && (<FormFeedback>Please input a valid email!</FormFeedback>)}
                            </InputGroup>
                            <InputGroup className="mb-3">
                              <CInputGroupPrepend>
                                <CInputGroupText>
                                    <i className="fa fa-phone"></i>
                                </CInputGroupText>
                              </CInputGroupPrepend>
                                <Controller
                                    as={Input}
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    placeholder="+63(XXXXXXXXXX)"
                                    control={control}
                                    rules={{ 
                                      required: true, 
                                      pattern: /^([+]\d{2})?\d{10}$/
                                   }}
                                    invalid={errors.phone ? true : false}
                                    value={formData.phone}
                                    defaultValue={formData.phone}
                                    onChange={onchange}
                                />
                                  {errors.phone && errors.phone.type == "required" && (<FormFeedback>Phone No. 1 is Required!</FormFeedback>)}
                                  {errors.phone && errors.phone.type == "pattern" && (<FormFeedback>Please input a valid Phone No.!</FormFeedback>)}
                            </InputGroup>
                            <InputGroup className="mb-3">
                              <CInputGroupPrepend>
                                <CInputGroupText>
                                  <CIcon name="cil-user" />
                                </CInputGroupText>
                              </CInputGroupPrepend>
                                <Controller
                                    as={Input}
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    placeholder="First Name"
                                    control={control}
                                    rules={{ required: true }}
                                    invalid={errors.first_name ? true : false}
                                    value={formData.first_name}
                                    defaultValue={formData.first_name}
                                    onChange={onchange}
                                />
                                  {errors.first_name && (
                                    <FormFeedback>First Name is Required!</FormFeedback>
                                  )}
                            </InputGroup>
                            <InputGroup className="mb-3">
                              <CInputGroupPrepend>
                                <CInputGroupText>
                                  <CIcon name="cil-user" />
                                </CInputGroupText>
                              </CInputGroupPrepend>
                                <Controller
                                    as={Input}
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    placeholder="Last Name"
                                    control={control}
                                    rules={{ required: true }}
                                    invalid={errors.last_name ? true : false}
                                    value={formData.last_name}
                                    defaultValue={formData.last_name}
                                    onChange={onchange}
                                />
                                  {errors.last_name && (
                                    <FormFeedback>Last Name is Required!</FormFeedback>
                                  )}
                            </InputGroup>
                            <CInputGroup className="mb-3">
                              <CInputGroupPrepend>
                                <CInputGroupText>
                                  <CIcon name="cil-lock-locked" />
                                </CInputGroupText>
                              </CInputGroupPrepend>
                                <Controller
                                    as={Input}
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    control={control}
                                    rules={{ required: true }}
                                    invalid={errors.password ? true : false}
                                    value={formData.password}
                                    defaultValue={formData.password}
                                    onChange={onchange}
                                />
                                  {errors.password && (
                                    <FormFeedback>Password is Required!</FormFeedback>
                                  )}
                            </CInputGroup>
                            <CInputGroup className="mb-3">
                              <CInputGroupPrepend>
                                <CInputGroupText>
                                  <CIcon name="cil-lock-locked" />
                                </CInputGroupText>
                              </CInputGroupPrepend>
                                <Controller
                                    as={Input}
                                    type="password"
                                    id="password2"
                                    name="password2"
                                    placeholder="Repeat Password"
                                    control={control}
                                    rules={{ required: true }}
                                    invalid={errors.password2 ? true : false}
                                    value={formData.password2}
                                    defaultValue={formData.password2}
                                    onChange={onchange}
                                />
                                  {errors.password2 && (
                                    <FormFeedback>Password is Required!</FormFeedback>
                                  )}
                            </CInputGroup>
                            <Button type="submit" color="success" block>Create Account</Button>
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

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
}

export default connect(null, { setAlert, register } )(Register);