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
    Spinner,
    InputGroup,
    InputGroupAddon,
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
    import { getRecords, getRecord, storeRecord , updateRecord, deleteRecord , clearRecord } from '../../../actions/whsStandard';
    import PropTypes from 'prop-types';
    import dropdown_items from "./WHSType_dropdown_items"
    import TimePicker from "rc-time-picker";
    import "./timepicker-custom.css";
    import moment from "moment";

const WHSStandard = ({records, record, totalSize, getRecords, getRecord, storeRecord,  updateRecord, deleteRecord, clearRecord, workDaysPerYear, workMonthsPerYear}) => {
    const { control, handleSubmit, register, errors, setValue } = useForm();  
    const [menuItemName, setMenuItemName] = useState("WHS-Standard") // For dynamic naming of menu item
    const [formData, setFormData] = useState({});
    const [page1, setPage1] = useState(1);
    const [sortFieldQuery, setSortFieldQuery] = useState("id");
    const [sortOrderQuery, setSortOrderQuery] = useState("asc");
    const [sizePerPageQuery, setSizePerPageQuery] = useState(10);
    const [addOrEditModal, setAddOrEditModal] = useState(false);
    const [action, setAction] = useState("");
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [buttonSpinner, setButtonSpinner] = useState(false);
    const [selectOptions, setSelectOptions] = useState(dropdown_items);

    /* Default */
    const blank = {
      wd_per_year: "",
      wh_per_day: 8,
      wm_per_year: "",
      wh_start: "",
      wh_end:  "",
      break_hours:  "",
      rd_monday:  "",
      rd_tuesday:  "",
      rd_wednesday: "",
      rd_thursday: "",
      rd_friday: "",
      rd_saturday: 1,
      rd_sunday: 1
    }
    /* Load select options */
    useEffect(()=>{
      setSelectOptions({...selectOptions,wd_per_year_options:workDaysPerYear,wm_per_year_options: workMonthsPerYear})
    },[workDaysPerYear, workMonthsPerYear]
    )

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
    },[records])

    /* Pass User Data from redux to local state */
    useEffect(()=>{
      setFormData(record)
    },[record])

    const reloadTable = async ()=> {
      await getRecords( 
        page1,
        sortFieldQuery,
        sortOrderQuery,
        sizePerPageQuery,
        searchText
      )
    }

    /* Display Form Base of Action */
    useEffect(()=>{
        /* clear form data before opening modal*/
      if(action=="create"){
          setFormData(blank);
          setAddOrEditModal(!addOrEditModal);
      } 

        /* open modal when the loading is done */
      if(action=="update" && formData.id){
          setAddOrEditModal(!addOrEditModal);
      } 

      if(action==""){
          clearRecord();
          setAddOrEditModal(false);
      }
     },
     [action])

     /* All bout forms */

    // Handle Text Change 
    const handleTextChange = (value) =>{
        setFormData({...formData, [value.target.name]: value.target.value })
    }

    // Handle Opening Add Modal
    const toggleAddModal = () => {
        setAction("create");
    };

    // Handle Opening Edit Modal
    const toggleEditModal = async (id) => {
        await getRecord(id)
        setAction("update");
    };

    // Handle Closing Modal 
    const toggleAddOrEditModal = () => {
        setAction("");
    };

    // Handle Deleting Record
    const handleDeletingRecord = (id) =>{
        Swal.fire({
          title: "Are you sure you want to delete the record?",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
        }).then(async (result) => {
          if (result.value) {
            const deleteStatus = await deleteRecord(id)
            if (deleteStatus) {
              Swal.fire(
                'DELETED!',
                'Record has been successfully deleted.',
                'success'
              ).then(()=>{reloadTable()})
            }
            else {
              Swal.fire(
                'WARNING!',
                'Record is not succesfully deleted. Please try again later',
                'warning',
              )
            }
          }
        })
      }


    // Handle Submitting Form
    const onSubmit = () => {
        if(action == "create"){
          setButtonSpinner(true)
          Swal.fire({
            title: "Are you sure you want to save the record?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
          }).then(async (result) => {
            if (result.value) {
              const storeStatus = await storeRecord(formData)
              if (storeStatus) {
                Swal.fire(
                  'CREATED!',
                  'Record has been successfully created.',
                  'success'
                )
                .then(setButtonSpinner(false))
                .then(()=>{
                  reloadTable();
                  toggleAddOrEditModal();
                })
              }
              else {
                Swal.fire(
                  'WARNING!',
                  'Record is not succesfully created. Please try again later',
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
                const updateStatus = await updateRecord(formData)
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
      dataField: "type",
      text: "Type",
      sort: true,
      formatter: ((cell)=>{
          return "Standard"
      })
    },
    {
        dataField: "wd_per_year",
        text: "Working Days Per Year",
        sort: true,
    },
    {
        dataField: "wh_per_day",
        text: "Working Hours Per Day",
        sort: true,
    },
    {
        dataField: "wm_per_year",
        text: "Working Months Per Day",
        sort: true,
    },
    {
        dataField: "wh_start",
        text: "Working Hours Start",
        sort: true,
    },
    {
        dataField: "wh_end",
        text: "Working Hours End",
        sort: true,
    },
    {
        dataField: "break_hours",
        text: "Break Hours",
        sort: true,
    },
    {
      dataField: "created_at",
      text: "created_at",
      sort: true,
    },
    {
      dataField: "id",
      text: "Actiions",
      formatter: (cell, row) => {
        return (
          <Fragment>
            <Button
              onClick={() => toggleEditModal(row.id)}
              className="mr-1 bg-warning">
              <i className="fa fa-pencil"></i>
            </Button>
          </Fragment>
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
                                        Columns: Code, Description, Remarks
                                    </small>
                                    </p>
                                </Col>
                            </FormGroup>
                            <RemoteAll
                                loading={loading}
                                data={records}
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
                toggle={toggleAddOrEditModal}
                className={"modal-lg"}
                backdrop={"static"}
            >
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader toggle={toggleAddOrEditModal}>
                        {action == "create" ? "Add " + menuItemName : "Edit " + menuItemName}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12">
                                <FormGroup>
                                    <Label htmlFor="type">Type<span style={{ color: "red" }}> * </span></Label>
                                    <Select
                                      options={selectOptions.working_hours_schedule_type}
                                      type="text"
                                      id="type"
                                      name="type"
                                      isDisabled={true}
                                      ref={register({ 
                                        required: true, 
                                      })}
                                      invalid={errors.working_hours_schedule_type ? true : false}
                                      defaultValue={selectOptions.working_hours_schedule_type[0]}
                                      onChange={(value)=>{
                                          setFormData({...formData,working_hours_schedule_type:value.value})
                                          return value;
                                      }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs="12">
                                <FormGroup>
                                    <Label htmlFor="wd_per_year">Working Days Per Year <span style={{ color: "red" }}> * </span></Label>
                                    <Select
                                      options={selectOptions.wd_per_year_options}
                                      type="text"
                                      id="wd_per_year"
                                      name="wd_per_year"
                                      ref={
                                        register(
                                          { name: "wd_per_year" },
                                          { required: true }
                                        )
                                      }
                                      invalid={errors.wd_per_year?true:false}
                                      defaultValue={action == 'update' ? {value: formData.wd_per_year, label: getOptionLabelByValue(selectOptions.wd_per_year_options, formData.wd_per_year )   } : ""}
                                      onChange={(value)=>{
                                          setFormData({...formData,wd_per_year:value.value})
                                          setValue("wd_per_year",value)
                                          return value;
                                      }}
                                    />
                                    {errors.wd_per_year && 
                                      <span style={{
                                            width: "100%",
                                            marginTop: "0.25rem",
                                            fontSize: "80%",
                                            color:"#e55353"}}> 
                                            Total Working Days is Required!
                                      </span>
                                    }
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <FormGroup>
                                <Label htmlFor="wh_per_day">Working Hours Per Day <span style={{ color: "red" }}> * </span></Label>
                                    <Input 
                                        name="wh_per_day"
                                        type="text"
                                        defaultValue={formData.wh_per_day}
                                        invalid={errors.wh_per_day?true:false}
                                        innerRef={register({ required: true })}
                                        onChange={handleTextChange}
                                        />
                                    <FormFeedback> Working Hours is Required!</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                            <FormGroup>
                                    <Label htmlFor="wm_per_year">Working Months Per Year <span style={{ color: "red" }}> * </span></Label>
                                    <Select
                                      options={selectOptions.wm_per_year_options}
                                      type="text"
                                      id="wm_per_year"
                                      hasValue={false}
                                      name="wm_per_year"
                                      ref={() =>
                                        register(
                                          { name: "wm_per_year" },
                                          { required: true }
                                        )
                                      }
                                      invalid={errors.wm_per_year ? true : false}
                                      defaultValue={action == 'update' ? {value: formData.wm_per_year, label: getOptionLabelByValue(selectOptions.wm_per_year_options, formData.wm_per_year )   } : ""}
                                      onChange={(value)=>{
                                          setFormData({...formData,wm_per_year:value.value})
                                          setValue("wm_per_year",value)
                                          return value;
                                      }}
                                    />
                                     {errors.wm_per_year && 
                                      <span style={{
                                            width: "100%",
                                            marginTop: "0.25rem",
                                            fontSize: "80%",
                                            color:"#e55353"}}> 
                                            Total Working Days is Required!
                                      </span>
                                    }
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                          <Col xs="4">
                            <FormGroup>
                                <Label
                                    htmlFor="wh_start"
                                    style={{ display: "block" }}
                                    >
                                Working Hours Start
                                </Label>
                                <TimePicker
                                  onChange={(value)=>{
                                      setFormData({...formData,wh_start:value.value})
                                      return value;
                                  }}
                                  showSecond={false}
                                  format={"HH:mm A"}
                                  use12Hours
                                  id="wh_start"
                                  name="wh_start"
                                  placeholder="Click to select a time"
                                  defaultValue={formData.wh_start?moment(formData.wh_start,"HH:mm A"):null}
                              />
                            </FormGroup>
                        </Col>
                          <Col xs="4">
                            <FormGroup>
                                <Label
                                    htmlFor="wh_end"
                                    style={{ display: "block" }}
                                    >
                                Working Hours End
                                </Label>
                                <TimePicker
                                  onChange={(value)=>{
                                      setFormData({...formData,wh_end:value.value})
                                      return value;
                                  }}
                                  showSecond={false}
                                  format={"HH:mm A"}
                                  use12Hours
                                  id="wh_end"
                                  name="wh_end"
                                  placeholder="Click to select a time"
                                  defaultValue={formData.wh_start?moment(formData.wh_start,"HH:mm A"):null}
                              />
                            </FormGroup>
                        </Col>
                        <Col xs="4">
                            <FormGroup>
                                <Label
                                    htmlFor="break_hours"
                                    style={{ display: "block" }}
                                    >
                                Break Hours
                                </Label>
                            <TimePicker
                                onChange={(value)=>{
                                    setFormData({...formData,break_hours:value.value})
                                    return value;
                                }}
                                showSecond={false}
                                format={"HH:mm A"}
                                use12Hours
                                id="break_hours"
                                name="break_hours"
                                placeholder="Click to select a time"
                                defaultValue={formData.wh_start?moment(formData.wh_start,"HH:mm A"):null}
                            />
                            </FormGroup>
                        </Col>
                  </Row>    
                      <Row>
                            <Label sm={2}>Rest Days</Label>
                                <Col xs={2} className="pt-1">
                                    <FormGroup>
                                        <Label check>
                                        <Input
                                            type="checkbox"
                                            id="rd_monday"
                                            name="rd_monday"
                                            defaultValue={formData.rd_monday?true:false}
                                            onChange={(event)=>{
                                              setFormData({...formData,rd_monday:event})
                                              return event.target.value
                                            }}
                                        />
                                        Monday
                                        </Label>
                                    </FormGroup>
                                </Col>
                                <Col xs={2} className="pt-1">
                                    <FormGroup>
                                        <Label check>
                                        <Input
                                            type="checkbox"
                                            id="rd_tuesday"
                                            name="rd_tuesday"
                                            defaultValue={formData.rd_tuesday?true:false}
                                            onChange={(event)=>{
                                              setFormData({...formData,rd_tuesday:event})
                                              return event.target.value
                                            }}
                                        />
                                        Tuesday
                                        </Label>
                                    </FormGroup>
                                </Col>
                                <Col xs={2} className="pt-1">
                                    <FormGroup>
                                        <Label check>
                                        <Input
                                            type="checkbox"
                                            id="rd_wednesday"
                                            name="rd_wednesday"
                                            defaultValue={formData.rd_wednesday?true:false}
                                            onChange={(event)=>{
                                              setFormData({...formData,rd_wednesday:event})
                                              return event.target.value
                                            }}
                                        />
                                        Wednesday
                                        </Label>
                                    </FormGroup>
                                </Col>
                                <Col xs={2} className="pt-1">
                                      <FormGroup>
                                        <Label check>
                                        <Input
                                            type="checkbox"
                                            id="rd_thursday"
                                            name="rd_thursday"
                                            defaultValue={formData.rd_thursday?true:false}
                                            onChange={(event)=>{
                                              setFormData({...formData,rd_thursday:event})
                                              return event.target.value
                                            }}
                                        />
                                        Thursday
                                        </Label>
                                    </FormGroup>
                                </Col>
                                <Col xs={2} className="pt-1 ">
                                      <FormGroup>
                                        <Label check>
                                        <Input
                                            type="checkbox"
                                            id="rd_friday"
                                            name="rd_friday"
                                            defaultValue={formData.rd_friday?true:false}
                                            onChange={(event)=>{
                                              setFormData({...formData,rd_friday:event})
                                              return event.target.value
                                            }}
                                        />
                                        Friday
                                        </Label>
                                    </FormGroup>
                                </Col>
                    </Row>  
                    <Row>
                              <Col xs={2} className="offset-2">
                                  <FormGroup>
                                    <Label check>
                                    <Input
                                        type="checkbox"
                                        id="rd_saturday"
                                        name="rd_saturday"
                                        checked={formData.rd_sunday==undefined?true:formData.rd_sunday}
                                        onChange={(event)=>{
                                          setFormData({...formData,rd_saturday:event})
                                          return event.target.value
                                        }}
                                    />
                                    Saturday
                                    </Label>
                                </FormGroup>
                            </Col>
                          <Col xs={2}>
                              <FormGroup>
                                  <Label check>
                                  <Input
                                      type="checkbox"
                                      id="rd_sunday"
                                      name="rd_sunday"
                                      checked={formData.rd_sunday==undefined?true:formData.rd_sunday}
                                      onChange={(event)=>{
                                        setFormData({...formData,rd_sunday:event})
                                        return event.target.value
                                      }}
                                  />
                                  Sunday
                                  </Label>
                              </FormGroup>
                        </Col>
                    </Row>
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
                            onClick={toggleAddOrEditModal}
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

WHSStandard.propTypes = {
    getRecords: PropTypes.func.isRequired,
    getRecord: PropTypes.func.isRequired,
    storeRecord: PropTypes.func.isRequired,
    updateRecord: PropTypes.func.isRequired,
    deleteRecord: PropTypes.func.isRequired,
    clearRecord: PropTypes.func.isRequired,
    records: PropTypes.array.isRequired,
    record: PropTypes.object.isRequired,
    totalSize: PropTypes.number.isRequired,
  }
  
  const mapStateToProps = state => ({
    records: state.whsStandard.records,
    record: state.whsStandard.record,
    totalSize: state.whsStandard.totalSize,
    workDaysPerYear: state.globalParameter.workDaysPerYear,
    workMonthsPerYear: state.globalParameter.workMonthsPerYear,
  })
  
  export default connect(mapStateToProps, { getRecords, getRecord, storeRecord , updateRecord, deleteRecord, clearRecord } )(WHSStandard);
  
  