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
import {Link} from 'react-router-dom'; 
import paginationFactory from "react-bootstrap-table2-paginator";
import overlayFactory from "react-bootstrap-table2-overlay";
import filterFactory from "react-bootstrap-table2-filter";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { useForm, Controller } from "react-hook-form";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import _ from "lodash"
import dropdown_items from "./user_module_dropdown_item";
import "@kenshooui/react-multi-select/dist/style.css";
import MultiSelect from "@kenshooui/react-multi-select";

const Users = () => {
  const { control, handleSubmit, register, errors, reset, getValues, setValue } = useForm();
  const [menuItemName, setMenuItemName] = useState("Users") // For dynamic naming of menu item
  const [user, setUser] = useState({}); 
  const [page1, setPage1] = useState(1);
  const [data, setData] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [sortFieldQuery, setSortFieldQuery] = useState("name");
  const [sortOrderQuery, setSortOrderQuery] = useState("asc");
  const [sizePerPageQuery, setSizePerPageQuery] = useState(10);
  const [viewModal, setViewModal] = useState(false);
  const [addOrEditModal, setAddOrEditModal] = useState(false);
  const [updateTable, setUpdateTable] = useState(false);
  const [action, setAction] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [selectOptions, setSelectOptions] = useState(dropdown_items)
  const [selectedModules, setSelectedModules] = useState([])

  /* Use Effect */ 
  useEffect(()=>{
    reloadTable();
  },[
      page1,
      sortFieldQuery,
      sortOrderQuery,
      sizePerPageQuery,
      updateTable,
      searchText,
    ]
  )

  const reloadTable =()=> {
    // dispatch the function to get the data
  }

  useEffect(()=>{
    setData([
      {
        "id": 1,
        "name": "Peñano, Lawrence",
        "email": "admin@gmail.com",
        "email_verified_at": null,
        "created_at": "2020-10-05T17:39:03.000000Z",
        "updated_at": "2020-10-05T17:39:03.000000Z",
        "user_name": "Lawrence7405/Admin",
        "role": "Super Admin",
        "status": "active",
        "status_id": 1
    },
    {
        "id": 2,
        "name": "Peñano, Lawrence",
        "email": "admin2@gmail.com",
        "email_verified_at": null,
        "created_at": "2020-10-06T03:06:09.000000Z",
        "updated_at": "2020-10-06T03:06:09.000000Z",
        "user_name": "Lawrence9045/Admin",
        "role": "Super Admin",
        "status": "active",
        "status_id": 1
    },
    {
        "id": 3,
        "name": "Peñano, Lawrence",
        "email": "admin3@gmail.com",
        "email_verified_at": null,
        "created_at": "2020-10-06T04:27:26.000000Z",
        "updated_at": "2020-10-06T04:27:26.000000Z",
        "user_name": "Lawrence885/Admin",
        "role": "Super Admin",
        "status": "active",
        "status_id": 1
    },
    {
        "id": 4,
        "name": "Peñano, Lawrence",
        "email": "admin4@gmail.com",
        "email_verified_at": null,
        "created_at": "2020-10-06T04:30:12.000000Z",
        "updated_at": "2020-10-06T04:30:12.000000Z",
        "user_name": "Lawrence3668/Admin",
        "role": "Super Admin",
        "status": "active",
        "status_id": 1
    },
    {
        "id": 5,
        "name": "Peñano, Lawrence",
        "email": "admin5@gmail.com",
        "email_verified_at": null,
        "created_at": "2020-10-06T04:40:08.000000Z",
        "updated_at": "2020-10-06T05:08:38.000000Z",
        "user_name": "Lawrence26/Admin",
        "role": "Super Admin",
        "status": "inactive",
        "status_id": 2
    }
  ])
  },[])

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

  const toggleAddModal = () => {
    setUser({}) // to clean up the modal
    setAction("create");
    setAddOrEditModal(!addOrEditModal);
  };

  const toggleEditModal = async (id) => {
    setAction("update");
    setAddOrEditModal(!addOrEditModal);
  };

  
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
                onClick={() => changeStatus(cell,row.status_id)}
                className="mr-1 bg-danger">
                <i className="fa fa-recycle"></i>
                </Button>:
                 <Button
                 onClick={() => changeStatus(cell,row.status_id)}
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
      onTableChange,
      totalSize,
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
      { page, sizePerPage, filters, sortField, sortOrder }
    ) => {
      if (page !== page1) {
        setPage1(page);
  
        setSortFieldQuery(sortField);
        setSortOrderQuery(sortOrder);
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
  
  /* Utilies */
  const getOptionLabelByValue = (options, value, source) => {
    if (value != undefined && options.length) {
      const option = options.find((option) => (option.id ? option.id.toString() : option.value.toString()) == value.toString())
      return option ? option.label : "";
    }
  };

  const handleSelectedModules = (modules) =>{
    setSelectedModules({ ...selectedModules, modules });
  }

  const changeStatus = (id, status_id) =>{
    let status = status_id==1?"Deactivate":"Activate";
    Swal.fire({
      title: "Are you sure you want to " + status + " the product?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then(async (result) => {
      if (result.value) {
        const deleteStatus = 1 // await discountTypeActions.deleteDiscount(prod_id)
        if (deleteStatus) {
          Swal.fire(
            'UPDATED!',
            'Product Status has been successfully updated.',
            'success'
          ).then(() => {
            window.location.reload(true);
          })
        }
        else {
          Swal.fire(
            'WARNING!',
            'Product is not deleted. Please try again later',
            'warning',
          )
        }
      }
    })
  }

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
                    // onClick={() => toggleAddModal()}
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
                  data={data}
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
            toggle={toggleAddModal}
            className={"modal-lg"}
            backdrop={"static"}
        >
          <Form >
            <ModalHeader toggle={toggleAddModal}>
              {action == "create" ? "Add " + menuItemName : "Edit " + menuItemName}
            </ModalHeader>
            <ModalBody>
              {/* This is to add the input for ID if the action is update */}
              {action == "update" && (
                <Controller
                  as={Input}
                  type="hidden"
                  control={control}
                  // defaultValue={blog.id}
                  name="id"
                />
              )}
                <Row>
                    <Col xs="12">
                      <FormGroup>
                        <Label htmlFor="subject">Name <span style={{ color: "red" }}> * </span></Label>
                        <Controller
                          as={Input}
                          type="text"
                          id="name"
                          name="name"
                          disabled={true}
                          placeholder="Name"
                          control={control}
                          defaultValue={user.name}
                          value={user.name}
                        />
                      </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                      <FormGroup>
                        <Label htmlFor="subject">Emai <span style={{ color: "red" }}> * </span></Label>
                        <Controller
                          as={Input}
                          type="text"
                          id="email"
                          name="email"
                          disabled={true}
                          placeholder="Email"
                          control={control}
                          defaultValue={user.email}
                          value={user.email}
                        />
                      </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                      <FormGroup>
                        <Label htmlFor="subject">User Name <span style={{ color: "red" }}> * </span></Label>
                        <Controller
                          as={Input}
                          type="text"
                          id="use_name"
                          name="use_name"
                          disabled={true}
                          placeholder="User Name"
                          control={control}
                          defaultValue={user.use_name}
                          value={user.use_name}
                        />
                      </FormGroup>
                    </Col>
                </Row>
                <Col xs="12">
                        <FormGroup>
                          <Label htmlFor="working_hours_schedule">Working Hours Schedule <span style={{ color: "red" }}> * </span></Label>
                          <Controller
                            as={
                              <Select
                                options={selectOptions.roles}
                              />
                            }
                            type="text"
                            id="working_hours_schedule_type"
                            name="working_hours_schedule_type"
                            control={control}
                            rules={{ required: true }}
                            invalid={errors.working_hours_schedule_type ? true : false}
                            defaultValue={action == 'update' ? {value: user.role, label: getOptionLabelByValue(selectOptions.roles, user.role )   } : ""}
                            value={action == 'update' ? {value: user.role, label: getOptionLabelByValue(selectOptions.roles, user.role )   } : ""}
                            onChange={([value])=>{
                                return value;
                            }}
                          />
                          {errors.roles && (
                            <div
                              style={{
                                marginTop: "0.25rem",
                                fontSize: "80%",
                                color: "#f86c6b",
                              }}
                            >
                              Role is required!
                            </div>
                          )}
                        </FormGroup>
                  </Col>
                  <Col xs="12">
                        <FormGroup>
                          <Label htmlFor="modules">Modules<span style={{ "color": "red" }}>*</span></Label>
                          <Controller
                            defaultValue={selectedModules}
                            selectedItems={selectedModules}
                            items={selectOptions.modules.map((item) => { return { "id": item.value, label: item.label } })}
                            as={
                              <MultiSelect
                                onChange={handleSelectedModules}
                              />
                            }
                            control={control}
                            id="card_type"
                            name="card_type"
                            // rules={{
                            //   validate: (value) => {
                            //     return value !== undefined && value.length > 0;
                            //   },
                            // }}
                          />
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
                          <Button
                            color="primary"
                            id="update-card-type"
                            disabled={buttonSpinner}
                            // onClick={e=>editBlog()}
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
                        )}
                      <Button
                        color="secondary"
                        onClick={toggleAddModal}
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

export default Users
