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
    import paginationFactory from "react-bootstrap-table2-paginator";
    import filterFactory from "react-bootstrap-table2-filter";
    import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
    import overlayFactory from "react-bootstrap-table2-overlay";
    import { useForm, Controller } from "react-hook-form";
    import Select from "react-select";
    import _ from "lodash";
    import Swal from 'sweetalert2';
    import { connect } from 'react-redux';
    import { getCompanies, getCompany, updateCompany , changeStatus, clearCompany } from '../../../actions/company';
    import PropTypes from 'prop-types';
    import dropdown_items from "./company_dropdown_items"


const Company = ({companies, company, totalSize, getCompanies, getCompany, updateCompany, changeStatus, clearCompany}) => {
    const { control, handleSubmit, register, errors } = useForm();  
    const [menuItemName, setMenuItemName] = useState("Company") // For dynamic naming of menu item
    const [formData, setFormData] = useState({});
    const [imageURL, setImageURL] = useState("");
    const [page1, setPage1] = useState(1);
    const [sortFieldQuery, setSortFieldQuery] = useState("id");
    const [sortOrderQuery, setSortOrderQuery] = useState("asc");
    const [sizePerPageQuery, setSizePerPageQuery] = useState(10);
    const [addOrEditModal, setAddOrEditModal] = useState(false);
    const [action, setAction] = useState("");
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [buttonSpinner, setButtonSpinner] = useState(false);
    const [selectOptions, setSelectOptions] = useState(dropdown_items)
    const [WHSType, setWHSType] = useState(0)

    /* Use Effect */ 
    useEffect(()=>{
      reloadTable();
    },[
        page1,
        sortFieldQuery,
        sortOrderQuery,
        sizePerPageQuery,
        searchText
      ]
    )

    /* To stop loading of table*/
    useEffect(()=>{
      setLoading(false)
    },[companies])

    /* Pass User Data from redux to local state */
    useEffect(()=>{
      setFormData(company)
      setWHSType(company.working_hours_schedule_type)
    },[company])

    const reloadTable = async ()=> {
     await getCompanies( 
        page1,
        sortFieldQuery,
        sortOrderQuery,
        sizePerPageQuery,
        searchText
      )
    }
  
    /* All bout forms */

      // Handle Text Change 
    const handleTextChange = (value) =>{
      setFormData({...formData, [value.target.name]: value.target.value })
    }

    const toggleAddModal = () => {
      if(!addOrEditModal) {
        setAction("create");
        setAddOrEditModal(!addOrEditModal);
      } else {
        setFormData({});
        setAction("");
        setAddOrEditModal(!addOrEditModal);
      }
    };
    
    const toggleEditModal = async (id) => {
      if(!addOrEditModal) {
        setAction("update");
        await getCompany(id)
        setAddOrEditModal(!addOrEditModal);
      } else {
        clearCompany()
        setFormData({})
        setImageURL("")
        setAction("");
        setAddOrEditModal(!addOrEditModal);
      }
    };

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
            const updateStatus = await updateCompany(formData)
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
              ).then(()=>{
                setButtonSpinner(false)
              })
            }
          }else{
            setButtonSpinner(false)
          }
        })
      }
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

    /* MODIFY THIS TABLE WITH THE CORRECT DATA FIELD NAMES OF THE MODEL */
    const columns = [
      {
        dataField: "company_name",
        text: "Company Name",
        sort: true,
      },
      {
        dataField: "nature_of_business",
        text: "Nature of Business",
        sort: true,
      },
      {
        dataField: "address_1",
        text: "Address 1",
        sort: true,
      },
      {
        dataField: "email",
        text: "Email",
        sort: true,
      },
      {
        dataField: "phone",
        text: "Phone No.",
        sort: true,
      },
      {
        dataField: "created_at",
        text: "Created at",
        sort: true,
      },
      {
        dataField: "id",
        text: "Actiions",
        formatter: (cell, row) => {
          return (
            <>
              <Button
                onClick={() => toggleEditModal(cell)}
                className="mr-1 bg-warning">
                <i className="fa fa-pencil"></i>
              </Button>
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

  /* Utilies */
  const getOptionLabelByValue = (options, value, source) => {
    if (value != undefined && options.length) {
      const option = options.find((option) => (option.id ? option.id.toString() : option.value.toString()) == value.toString())
      return option ? option.label : "";
    }
  };

  return (
    <Fragment>
      <div className="animated fadeIn">
      <Row>
        <Col xs="12">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i>
              <strong>{menuItemName}</strong>
            </CardHeader>
            <CardBody>
              <div className="mb-2">
                <Button
                  onClick={() => toggleAddModal()}
                  color="success"
                  id="add-card-type"
                  disabled={true}
                >
                  <i className="fa fa-plus"></i>&nbsp;Add {menuItemName}
                </Button>
              </div>

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
                        Columns: Company Name
                      </small>
                    </p>
                  </Col>
                </FormGroup>

                <RemoteAll
                  loading={loading}
                  data={companies}
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
             />
            )}
             <Row>
                    <Col xs="12">
                        <img className="img-fluid" style={{ height: "200px", width: "200px", objectFit: "cover" }} src={imageURL ? imageURL : formData.company_logo}/>
                    </Col>
                    <Col xs="6">
                        <FormGroup>
                            <Label htmlFor="image">Comapany Logo <span style={{ color: "red" }}> * </span></Label>
                            <Input
                              invalid={errors.company_logo?true:false}
                              defaultValue={[]}
                              type="file"
                              id="company_logo"
                              name="company_logo"
                              innerRef={register({ required: formData.company_logo?false:true })}
                              onChange={(event) => {
                                setImageURL(URL.createObjectURL(event.target.files[0]))
                                setFormData({
                                  ...formData,
                                  company_logo: event.target.files[0],
                                });
                                return event.target.value;
                              }}
                            />
                            <FormFeedback> Company Logo is Required!</FormFeedback>
                        </FormGroup>
                    </Col>
              </Row>
              <Row>
                      <Col xs="12">
                        <FormGroup>
                          <Label htmlFor="company_name">Company Name <span style={{ color: "red" }}> * </span></Label>
                          <Input 
                              name="company_name"
                              type="text"
                              defaultValue={formData.company_name}
                              invalid={errors.company_name?true:false}
                              innerRef={register({ required: true })}
                              onChange={handleTextChange}
                            />
                            <FormFeedback> Company Name is Required!</FormFeedback>
                          </FormGroup>
                      </Col>
              </Row>
              <Row>
                      <Col xs="12">
                        <FormGroup>
                          <Label htmlFor="nature_of_business">Nature of Business <span style={{ color: "red" }}> * </span></Label>
                          <Input
                            name="nature_of_business"
                            type="text"
                            defaultValue={formData.nature_of_business}
                            innerRef={register({ required: true })}
                            invalid={errors.nature_of_business?true:false}
                            onChange={handleTextChange}
                          />
                            <FormFeedback>Nature of Business is Required!</FormFeedback>
                        </FormGroup>
                      </Col>
              </Row>
              <Row>
                      <Col xs="12">
                        <FormGroup>
                          <Label htmlFor="address_1">Address 1 <span style={{ color: "red" }}> * </span></Label>
                          <Input
                            name="address_1"
                            type="text"
                            defaultValue={formData.address_1}
                            innerRef={register({ required: true })}
                            invalid={errors.address_1?true:false}
                            onChange={handleTextChange}
                          />
                            <FormFeedback>Address 1 is Required!</FormFeedback>
                        </FormGroup>
                      </Col>
              </Row>
              <Row>
                      <Col xs="12">
                        <FormGroup>
                          <Label htmlFor="address_2">Address 2 </Label>
                          <Input
                            type="text"
                            name="address_2"
                            defaultValue={formData.address_2}
                            onChange={handleTextChange}
                          />
                        </FormGroup>
                      </Col>
              </Row>
              <Row>
                      <Col xs="12">
                        <FormGroup>
                          <Label htmlFor="zip_code">Zip Code</Label>
                          <Input
                            type="text"
                            name="zip_code"
                            defaultValue={formData.zip_code}
                            onChange={handleTextChange}
                          />
                        </FormGroup>
                      </Col>
              </Row>
              <Row>
                      <Col xs="12">
                        <FormGroup>
                          <Label htmlFor="rdo">RDO</Label>
                          <Input
                            type="text"
                            name="rdo"
                            defaultValue={formData.zip_code}
                            onChange={handleTextChange}
                          />
                        </FormGroup>
                      </Col>
              </Row>
              <Row>
                      <Col xs="12">
                        <FormGroup>
                          <Label htmlFor="email">Email </Label>
                          <Input
                            type="text"
                            name="email"
                            innerRef={register({ 
                              required: true, 
                              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                            })}
                            defaultValue={formData.email}
                            onChange={handleTextChange}
                            invalid={errors.email ? true : false}
                          />
                           {errors.email && errors.email.type == "required" && (<FormFeedback>Email is Required!</FormFeedback>)}
                           {errors.email && errors.email.type == "pattern" && (<FormFeedback>Please input a valid email!</FormFeedback>)}
                        </FormGroup>
                        
                      </Col>
              </Row>
              <Row>
                      <Col xs="12">
                        <FormGroup>
                          <Label htmlFor="phone">Phone No. </Label>
                          <Input
                            name="phone"
                            type="text"
                            innerRef={register({ 
                              required: true, 
                              pattern: /((^(\+)(\d){12}$)|(^\d{11}$))/
                            })}
                            invalid={errors.phone ? true : false}
                            defaultValue={formData.phone}
                            onChange={handleTextChange}
                          />
                           {errors.phone && errors.phone.type == "required" && (<FormFeedback>Phone No. 1 is Required!</FormFeedback>)}
                           {errors.phone && errors.phone.type == "pattern" && (<FormFeedback>Please input a valid Phone No.!</FormFeedback>)}
                        </FormGroup>
                        
                      </Col>
              </Row>
              <Row>
                      <Col xs="12">
                        <FormGroup>
                          <Label htmlFor="fax">Fax </Label>
                          <Input
                            type="text"
                            name="fax"
                            defaultValue={formData.fax}
                            onChange={handleTextChange}
                          />
                        </FormGroup>
                      </Col>
              </Row>
              <Row>
                      <Col xs="12">
                        <FormGroup>
                          <Label htmlFor="tin_no">Tin No. </Label>
                          <Input
                            type="text"
                            name="tin_no"
                            defaultValue={formData.tin_no}
                            onChange={handleTextChange}
                          />
                        </FormGroup>
                      </Col>
              </Row>
              <Row>
                      <Col xs="12">
                        <FormGroup>
                          <Label htmlFor="sss_no">SSS No. </Label>
                          <Input
                            type="text"
                            name="sss_no"
                            defaultValue={formData.sss_no}
                            onChange={handleTextChange}
                          />
                        </FormGroup>
                      </Col>
              </Row>
              <Row>
                      <Col xs="12">
                        <FormGroup>
                          <Label htmlFor="hdmf_no">HDMF No. </Label>
                          <Input
                            type="text"
                            name="hdmf_no"
                            defaultValue={formData.hdmf_no}
                            onChange={handleTextChange}
                          />
                        </FormGroup>
                      </Col>
              </Row>
              <Row>
                      <Col xs="12">
                        <FormGroup>
                          <Label htmlFor="working_hours_schedule">Working Hours Schedule <span style={{ color: "red" }}> * </span></Label>
                          <Select
                            options={selectOptions.working_hours_schedule_type}
                            type="text"
                            id="working_hours_schedule_type"
                            name="working_hours_schedule_type"
                            innerRef={register({ 
                              required: true, 
                            })}
                            invalid={errors.working_hours_schedule_type ? true : false}
                            defaultValue={action == 'update' ? {value: formData.working_hours_schedule_type, label: getOptionLabelByValue(selectOptions.working_hours_schedule_type,formData.working_hours_schedule_type )   } : ""}
                            onChange={(value)=>{
                                setWHSType(value.value)
                                setFormData({...formData,working_hours_schedule_type:value.value})
                                return value;
                            }}
                          />
                          {errors.working_hours_schedule_type && (
                            <div
                              style={{
                                marginTop: "0.25rem",
                                fontSize: "80%",
                                color: "#f86c6b",
                              }}
                            >
                              Working Hours Schedule Type is required!
                            </div>
                          )}
                        </FormGroup>
                      </Col>
              </Row>
              { WHSType==3?
                 <Row>
                  <Col xs="12">
                    <FormGroup>
                      <Label htmlFor="no_of_shifts">No. of Shifts <span style={{ color: "red" }}> * </span></Label>
                          <Input
                            name="no_of_shifts"
                            type="number"
                            defaultValue={formData.no_of_shifts}
                            innerRef={register({ required: true, validate: (value)=> value > 0 })}
                            invalid={errors.no_of_shifts?true:false}
                            onChange={handleTextChange}
                          />
                          <FormFeedback>No. of Shift is Required!</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>:
                <></>
              }
          </ModalBody>
          <ModalFooter>
                    {action == "create" ? (
                      <Button
                        type="submit"
                        color="primary"
                        id="save-card-type"
                        disabled={buttonSpinner}
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
                          type="submit"
                          color="primary"
                          id="update-card-type"
                          disabled={buttonSpinner}
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
};

Company.propTypes = {
  getCompanies: PropTypes.func.isRequired,
  getCompany: PropTypes.func.isRequired,
  updateCompany: PropTypes.func.isRequired,
  changeStatus: PropTypes.func.isRequired,
  clearCompany: PropTypes.func.isRequired,
  companies: PropTypes.array.isRequired,
  company: PropTypes.object.isRequired,
  totalSize: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  companies: state.company.companies,
  company: state.company.company,
  totalSize: state.company.totalSize
})

export default connect(mapStateToProps, { getCompanies, getCompany, updateCompany, changeStatus, clearCompany } )(Company);


