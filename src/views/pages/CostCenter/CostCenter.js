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
    import _ from "lodash";
    import Swal from 'sweetalert2';
    import { connect } from 'react-redux';
    import { getRecords, getRecord, storeRecord , updateRecord, deleteRecord , clearRecord } from '../../../actions/costCenter';
    import PropTypes from 'prop-types';

const CostCenter = ({records, record, totalSize, getRecords, getRecord, storeRecord,  updateRecord, deleteRecord, clearRecord}) => {
    const { control, handleSubmit, register, errors } = useForm();  
    const [menuItemName, setMenuItemName] = useState("Cost Center") // For dynamic naming of menu item
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

    /* Default */
    const blank = {}
    
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
      dataField: "code",
      text: "Code",
      sort: true,
    },
    {
      dataField: "description",
      text: "Description",
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
      align: "center",
      formatter: (cell, row) => {
        return (
          <Fragment>
                <Button
                onClick={() => toggleEditModal(cell)}
                className="mr-1 bg-warning">
                <i className="fa fa-pencil"></i>
                </Button>
                <Button
                onClick={() => handleDeletingRecord(cell)}
                className="mr-1 bg-danger">
                <i className="fa fa-trash"></i>
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
                                    <Label htmlFor="code">Code<span style={{ color: "red" }}> * </span></Label>
                                    <Input 
                                        name="code"
                                        type="text"
                                        defaultValue={formData.code}
                                        invalid={errors.code?true:false}
                                        innerRef={register({ required: true })}
                                        onChange={handleTextChange}
                                        />
                                    <FormFeedback> Code is Required!</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <FormGroup>
                                    <Label htmlFor="description">Descrition<span style={{ color: "red" }}> * </span></Label>
                                    <Input 
                                        name="description"
                                        type="text"
                                        defaultValue={formData.description}
                                        invalid={errors.description?true:false}
                                        innerRef={register({ required: true })}
                                        onChange={handleTextChange}
                                        />
                                    <FormFeedback> Descrition is Required!</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <FormGroup>
                                    <Label htmlFor="remarks">Remarks<span style={{ color: "red" }}> * </span></Label>
                                    <Input 
                                        name="remarks"
                                        type="text"
                                        defaultValue={formData.remarks}
                                        invalid={errors.remarks?true:false}
                                        innerRef={register({ required: true })}
                                        onChange={handleTextChange}
                                        />
                                    <FormFeedback> Remarks is Required!</FormFeedback>
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

CostCenter.propTypes = {
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
    records: state.costCenter.records,
    record: state.costCenter.record,
    totalSize: state.costCenter.totalSize
  })
  
  export default connect(mapStateToProps, { getRecords, getRecord, storeRecord , updateRecord, deleteRecord, clearRecord } )(CostCenter);
  
  