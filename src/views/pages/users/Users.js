import React, { useState, useEffect, useRef, Fragment } from "react";
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
    Spinner
  } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import Select from "react-select";
import paginationFactory from "react-bootstrap-table2-paginator";
import overlayFactory from "react-bootstrap-table2-overlay";
import filterFactory from "react-bootstrap-table2-filter";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { useForm, Controller } from "react-hook-form";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import _ from "lodash"
import "@kenshooui/react-multi-select/dist/style.css";
import MultiSelect from "@kenshooui/react-multi-select";
import { connect } from 'react-redux';
import { getUsers, getUser, updateUser, resetPassword, changeStatus, clearUser } from '../../../actions/user';
import PropTypes from 'prop-types';


const Users = ({users, user, totalSize, getUsers, getUser, updateUser, modules, roles, resetPassword, changeStatus, clearUser}) => {
  const { control, handleSubmit, register, errors ,setError, clearErrors } = useForm();
  const [menuItemName, setMenuItemName] = useState("Users") // For dynamic naming of menu item
  const [formData, setFormData] = useState({});
  const [page1, setPage1] = useState(1);
  const [sortFieldQuery, setSortFieldQuery] = useState("users.id");
  const [sortOrderQuery, setSortOrderQuery] = useState("asc");
  const [sizePerPageQuery, setSizePerPageQuery] = useState(10);
  const [addOrEditModal, setAddOrEditModal] = useState(false);
  const [action, setAction] = useState("");
  const [searchText, setSearchText] = useState(" ");
  const [loading, setLoading] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [selectOptions, setSelectOptions] = useState({modules: [], roles: []})

  /* Use Effect */ 
  useEffect(()=>{
    reloadTable();
  },[
      page1,
      sortFieldQuery,
      sortOrderQuery,
      sizePerPageQuery,
      searchText,
    ]
  )

  useEffect(()=>{
   setSelectOptions({modules: modules, roles: roles})
  },[roles, modules])

  /* To stop loading of table*/
  useEffect(()=>{
    setLoading(false)
  },[users])

  /* Pass User Data from redux to local state */
  useEffect(()=>{
    setFormData(user)
  },[user])

  const reloadTable = async ()=> {
    await getUsers( 
      page1,
      sortFieldQuery,
      sortOrderQuery,
      sizePerPageQuery,
      searchText
    )
  }

  /* Search */
  const [userQuery, setUserQuery] = useState("");
  const delayedQuery = useRef(_.debounce((q) => sendQuery(q), 500)).current;
  const changeQuery = (e) => {
      setPage1(1);
      setUserQuery(e.target.value);
      delayedQuery(e.target.value);
    };
  const sendQuery = (query) => {
      setSearchText(query);
      setLoading(true);
  };

  /* Modal Triggers */
  const toggleAddModal = () => {
    setAction("create");
    setAddOrEditModal(!addOrEditModal);
  };
  
  const toggleEditModal = async (id) => {
    if(!addOrEditModal){
      setAction("update");
      await getUser(id)
      setAddOrEditModal(!addOrEditModal);
    }
    else{
      clearUser()
      setFormData({})
      setAction("");
      setAddOrEditModal(!addOrEditModal);
    }
  };

  /* Handle Form Butons*/
  const onSubmit = () => {
    if(action == "update"){
      setButtonSpinner(true)
      Swal.fire({
        title: "Are you sure you want to update the record?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then(async (result) => {
        if (result.value) {
          const updateStatus = await updateUser(formData)
          if (updateStatus) {
            Swal.fire(
              'UPDATED!',
              'Record has been successfully updated.',
              'success'
            )
            .then(setButtonSpinner(false))
            .then(()=>{reloadTable()
            })
          }
          else {
            Swal.fire(
              'WARNING!',
              'Record is not succesfully updated. Please try again later',
              'warning',
            )
          }
        }else{
          setButtonSpinner(false)
        }
      })
    }
  }
  const handleSelectedModules = (modules) =>{
    if(!modules.length){
      setError("modules",{
        type: "required"
      })
    }else{
      clearErrors("modules")
    }
    setFormData({ ...formData, assigned_modules: modules });
  }
  
  const handleChangeStatus = (id, status_id) =>{
    let status = JSON.parse(status_id)==1?"Deactivate":"Activate";
    Swal.fire({
      title: "Are you sure you want to " + status + " the product?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then(async (result) => {
      if (result.value) {
        const deleteStatus = await changeStatus(id)
        console.log(deleteStatus)
        if (deleteStatus) {
          Swal.fire(
            'UPDATED!',
            'Status has been successfully updated.',
            'success'
          ).then(()=>{reloadTable()})
        }
        else {
          Swal.fire(
            'WARNING!',
            'Status is not succesfully updated. Please try again later',
            'warning',
          )
        }
      }
    })
  }

  const handlePasswordReset = () =>{
    let id = formData.id;
    setButtonSpinner(true)
    Swal.fire({
      title: "Are you sure you want to reset the password of the user?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        const deleteStatus = resetPassword(id)
        if (deleteStatus) {
          Swal.fire(
            'UPDATED!',
            'Password has been successfully updated.',
            'success'
          ).then(() => {
            setButtonSpinner(false)
          })
        }
        else {
          Swal.fire(
            'WARNING!',
            'Password is not updated. Please try again later',
            'warning',
          ).then(() => {
            setButtonSpinner(false)
          })
        }
      }else{
          setButtonSpinner(false)
      }
    })
  }
  
  /* MODIFY THIS TABLE WITH THE CORRECT DATA FIELD NAMES OF THE MODEL */
  const columns = [
    {
      dataField: "name",
      text: "Name",
      sort: true,
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
    },
    {
      dataField: "user_name",
      text: "User Name",
      sort: true,
    },
    {
      dataField: "role",
      text: "Role",
      sort: true,
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
    },
    {
      dataField: "id",
      text: "Actions",
      align:"center",
      formatter: (cell, row) => {
        return (
          <>
            <Button
              onClick={() => toggleEditModal(cell)}
              className="mr-1 bg-warning">
              <i className="fa fa-pencil"></i>
            </Button>
            {
              row.status_id == 1?
              <Button
              onClick={() => handleChangeStatus(cell,row.status_id)}
              className="mr-1 bg-danger">
              <i className="fa fa-recycle"></i>
              </Button>:
              <Button
              onClick={() => handleChangeStatus(cell,row.status_id)}
              className="mr-1 bg-success">
              <i className="fa fa-recycle"></i>
              </Button>
            }
          </>
        );
      },
    }
  ];
  const defaultSorted = [
    {
      dataField: sortFieldQuery,
      order: sortOrderQuery,
    },
  ];
  const NoDataIndication = () => <div>No Data</div>;

  const RemoteAll = ({
    loading,
    data,
    page,
    sizePerPage,
    totalSize,
    onTableChange,
  }) => (
      <div>
        <BootstrapTable
          loading={loading}
          wrapperClasses="table-responsive"
          bootstrap4
          striped
          remote
          keyField="id"
          data={data}
          columns={columns}
          defaultSorted={defaultSorted}
          filter={filterFactory()}
          pagination={paginationFactory({ page, sizePerPage, totalSize })}
          onTableChange={onTableChange}
          overlay={overlayFactory({
            spinner: true,
            styles: {
              overlay: (base) => ({
                ...base,
                background: "rgba(0, 0, 0, 0.5)",
              }),
            },
          })}
          noDataIndication={() => <NoDataIndication />}
        />
      </div>
    );
  
  const handleTableChange = (
    type,
    { page, sizePerPage, sortField, sortOrder }
  ) => {
    
    if (page !== page1) {
      setPage1(page);
      setSortFieldQuery(sortFieldQuery);
      setSortOrderQuery(sortOrderQuery);
      setLoading(true);
    }

    if (
      (sortField != sortFieldQuery && sortField != undefined) ||
      (sortOrder != sortOrderQuery && sortOrder != undefined)
    ) {
      setSortFieldQuery(sortField);
      setSortOrderQuery(sortOrder);
      setLoading(true);
    }

    if (sizePerPage != sizePerPageQuery) {
      setSizePerPageQuery(sizePerPage);
      setLoading(true);
    }
  };

  return(
    <Fragment>
        <div>
        <Row>
          <Col xs="12">
            <Card>
              <CardHeader>
                <strong>{menuItemName}</strong>
              </CardHeader>
              <CardBody>
                <div className="mb-2">
                  <Button
                    onClick={toggleAddModal}
                    disabled={true}
                    color="success"
                    id="add-card-type"
                  >
                    <i className="fa fa-plus"></i>&nbsp;Add {menuItemName}
                  </Button>
                </div>
  
                <div>
                  <FormGroup row>
                    <Col md="4" className="ml-auto">
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <Button
                            type="button"
                            color="primary"
                            id="search-button"
                            className="mr-0"
                          >
                            <i className="fa fa-search"></i>
                          </Button>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          id="search-text"
                          name="search-text"
                          placeholder="Search"
                          onChange={changeQuery}
                        />
                      </InputGroup>
                      <p>
                        <small>
                          <i className="fa fa-lightbulb-o"></i>&nbsp;Searchable
                          Columns: Name, Email, User Name, Role
                        </small>
                      </p>
                    </Col>
                  </FormGroup>
                </div>
                <RemoteAll
                  loading={loading}
                  data={users}
                  page={page1}
                  sizePerPage={sizePerPageQuery}
                  totalSize={totalSize}
                  onTableChange={handleTableChange}
                  register={register}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
  
      {/* This is for ADD/EDIT Modal */}
        <Modal
            isOpen={addOrEditModal}
            toggle={toggleEditModal}
            className={"modal-lg"}
            backdrop={"static"}
        >
         <Form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader toggle={toggleEditModal}>
              {action == "create" ? "Add " + menuItemName : "Edit " + menuItemName}
            </ModalHeader>
            <ModalBody>
              {/* This is to add the input for ID if the action is update */}
              {action == "update" && (
                <Input
                  type="text"
                  defaultValue={formData.id}
                  name="id"
                  id="id"
                  hidden={true}
                  ref={register({ required: true })}
                />
              )}
                <Row>
                    <Col xs="12">
                      <FormGroup>
                        <Label htmlFor="name">Name <span style={{ color: "red" }}> * </span></Label>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          ref={register({ required: true })}
                          disabled={true}
                          placeholder="Name"
                          defaultValue={formData.name}
                        />
                      </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                      <FormGroup>
                        <Label htmlFor="subject">Emai <span style={{ color: "red" }}> * </span></Label>
                        <Input
                          type="text"
                          id="email"
                          name="email"
                          disabled={true}
                          placeholder="Email"
                          defaultValue={formData.email}
                          ref={register({ required: true })}
                        />
                      </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                      <FormGroup>
                        <Label htmlFor="subject">User Name <span style={{ color: "red" }}> * </span></Label>
                        <Input
                          type="text"
                          id="user_name"
                          name="user_name"
                          disabled={true}
                          placeholder="User Name"
                          defaultValue={formData.assigned_user_name?formData.assigned_user_name.user_name:""}
                          ref={register({ required: true })}
                        />
                      </FormGroup>
                    </Col>
                </Row>
                <Col xs="12">
                        <FormGroup>
                          <Label htmlFor="role">Roles <span style={{ color: "red" }}> * </span></Label>
                          <Select
                            options={selectOptions.roles}
                            value={formData.assigned_role}
                            onChange={(value)=>setFormData({...formData, assigned_role: value})}
                            type="text"
                            id="role"
                            name="role"
                            control={control}
                            ref={register({ required: true })}
                            />
                        </FormGroup>
                  </Col>
                  <Col xs="12">
                        <FormGroup>
                          <Label htmlFor="modules">Modules<span style={{ "color": "red" }}>*</span></Label>
                          <MultiSelect
                                items={selectOptions.modules.map((item) => { return { "id": item.value, label: item.label } })}
                                selectedItems={formData.assigned_modules?formData.assigned_modules:[]}
                                onChange={handleSelectedModules}
                                id="modules"
                                name="modules"
                            />
                               {errors.modules && (
                                    <div
                                      style={{
                                        marginTop: "0.25rem",
                                        fontSize: "80%",
                                        color: "#f86c6b",
                                      }}
                                    >
                                      Module is required!
                                    </div>
                                  )}
                        </FormGroup>
                    </Col>
                    
            </ModalBody>
            <ModalFooter>
                      {action == "create" ? (
                        <Button
                          color="primary"
                          id="save-card-type"
                          disabled={buttonSpinner}
                          // onClick={e=>saveBlog()}
                        >
                          {buttonSpinner ? (
                            <>
                              <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                              &nbsp;Processing...
                            </>
                          ) : (
                              "Save"
                            )}
                        </Button>
                      ) : (
                        <>
                          <Button
                              color="danger"
                              id="update-card-type"
                              disabled={buttonSpinner}
                              type="button"
                              onClick={handlePasswordReset}
                            >
                              {buttonSpinner ? (
                                <>
                                  <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                  />
                                &nbsp;Processing...
                                </>
                              ) : (
                                <div>
                                <i className="fas fa-lock mr-1"></i>
                                Reset Password
                                </div>
                                )}
                            </Button>
                            <Button
                              color="primary"
                              id="update-card-type"
                              disabled={buttonSpinner}
                              type="submit"
                            >
                              {buttonSpinner ? (
                                <>
                                  <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                  />
                                &nbsp;Processing...
                                </>
                              ) : (
                                  "Update"
                                )}
                            </Button>
                          </>
                        )}
                      <Button
                        color="secondary"
                        onClick={toggleEditModal}
                        id="cancel"
                      >
                        Cancel
                      </Button>
                    </ModalFooter>
          </Form>
                
        </Modal>
      </Fragment>
  )
}

Users.propTypes = {
  getUsers: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
  changeStatus: PropTypes.func.isRequired,
  clearUser: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  totalSize: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  users: state.user.users,
  user: state.user.user,
  totalSize: state.user.totalSize,
  modules: state.globalParameter.modules,
  roles: state.globalParameter.roles,
})

export default connect(mapStateToProps, { getUsers, getUser, updateUser, resetPassword, changeStatus, clearUser } )(Users);