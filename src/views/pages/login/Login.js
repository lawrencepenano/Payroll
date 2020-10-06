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

const Login = () => {
  const { control, handleSubmit, register, errors, reset, getValues, setValue } = useForm();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  })

  const { name, email, password , password2 } = formData;

  const onChange = e => setFormData({...formData, [e.target.name]:e.target.value});
  const onSubmit = async e => {
      e.preventDefault();
      console.log(e.target.value)
      if(password !== password2){
          // setAlert('Password do not match', 'danger')
      }else {
          // register({ name, email, password  })
      }
  }

  if(localStorage.getItem('user')){
      window.location.replace("/blogs")
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
                          <Form onSubmit={e=>onSubmit(e)}>
                             <h1 style={{color:"black"}}>Login</h1>
                             <p className="text-muted">Sign In to your account</p>
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
                                    placeholder="Email / Username"
                                    control={control}
                                    rules={{ required: true }}
                                    invalid={errors.email ? true : false}
                                />
                                  {errors.email && (
                                    <FormFeedback>Email is Required!</FormFeedback>
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
                                    invalid={errors.repeat_password ? true : false}
                                />
                                  {errors.password && (
                                    <FormFeedback>Password is Required!</FormFeedback>
                                  )}
                            </CInputGroup>
                            <CButton type="submit" color="success" block>Create Account</CButton>
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

export default Login
