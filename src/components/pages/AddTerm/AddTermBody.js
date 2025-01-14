import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Card } from "react-bootstrap";
import { DateRangePicker, SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import "react-dates/initialize";
import moment from "moment";
import userService from '../../../services/user.service'

export default class AddTermBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      terms: [],

      termEnglishName: "",
      termArabicName: "",
      termType: "regular",

      termStartDate: moment(),
      termEndDate: moment(),
      termFocusedInput: "startDate",

      registerStartDate: moment(),
      registerEndDate: moment(),
      registerFocusedInput: "startDate",

      editStartDate: moment(),
      editEndDate: moment(),
      editFocusedInput: "startDate",

      currentCourse: {
        code: "",
        nameEnglish: "",
        nameArabic: "",
      },

      availableCourses: [],

      selectedCourses: [],
    };
  }

  componentDidMount() {
    userService.getData("courses").then(
      (response) => {
        const data = response.data.courses;
        this.setState({ availableCourses: data });
      },
      (error) => {
        this.setState({
          availableCourses: [
            {
              code: "BCS213",
              nameEnglish: "Programming-2",
              nameArabic: "برمجة – ٢",
            },
            {
              code: "BCS241",
              nameEnglish: "Operating Systems",
              nameArabic: "نظم التشغیل",
            },
            {
              code: "BCS214",
              nameEnglish: "Data structures",
              nameArabic: "ھیاكل بیانات",
            },
          ],
        });
      }
    );

    const currentTerms = localStorage.getItem("terms");
    if (currentTerms) this.setState({ terms: JSON.parse(currentTerms) });
  }

  addTermData = (e) => {
    e.preventDefault();
    const term = {
      termEnglishName: this.state.termEnglishName,
      termArabicName: this.state.termArabicName,
      termType: this.state.termType,
      termStartDate: this.state.termStartDate.format("L"),
      termEndDate: this.state.termEndDate.format("L"),
      registerStartDate: this.state.registerStartDate.format("L"),
      registerEndDate: this.state.registerEndDate.format("L"),
      editStartDate: this.state.editStartDate.format("L"),
      editEndDate: this.state.editEndDate.format("L"),
      selectedCourses: this.state.selectedCourses,
    };

    this.setState((prevState) => ({
      terms: prevState.terms.concat(term),
    }));

    setTimeout(() => {
      localStorage.setItem("terms", JSON.stringify(this.state.terms));
      alert("Term added successfully");
      window.location.reload();
    }, 1);
  };

  onSaveModalClick = (e) => {
    const section = document.getElementById("radioSuccess2");
    const newCourse = {
      code: this.state.currentCourse.code,
      nameEnglish: this.state.currentCourse.nameEnglish,
      nameArabic: this.state.currentCourse.nameArabic,
      doctorName: document.getElementById("doctorName").value,
      type: "group",
      groupData: {},
      sectionGroupsData: [],
    };

    if (section.checked) {
      newCourse.type = "section";
      const sectionGroupsNumber = parseInt(
        document.getElementById("numberOfSectionGroups").value
      );
      for (let i = 1; i <= sectionGroupsNumber; ++i) {
        const group = {
          groupNumber: `${i}`,
          demonstratorName: document.getElementById(`demonstrator${i}`).value,
          day: document.getElementById(`select${i}`).value,
          time: document.getElementById(`time${i}`).value,
        };
        newCourse.sectionGroupsData.push(group);
      }
    } else {
      newCourse.type = "group";
      newCourse.groupData = {
        demonstratorName: document.getElementById("groupDemonstrator").value,
        day: document.getElementById("groupSelect").value,
        time: document.getElementById("groupTime").value,
      };
    }

    const newSelectedCourses = this.state.selectedCourses.concat(newCourse);
    const newAvailableCourses = this.state.availableCourses.filter(
      (course) => course.code != newCourse.code
    );

    this.setState(() => ({
      availableCourses: newAvailableCourses,
      selectedCourses: newSelectedCourses,
    }));
  };

  onRemoveClick = (e) => {
    const deletedCourseCode = e.target.name;
    const deletedCourse = this.state.selectedCourses.find((course) => {
      if (course.code === deletedCourseCode) return true;
    });

    const newSelectedCourses = this.state.selectedCourses.filter((course) => {
      if (deletedCourseCode === null) return true;
      return course.code != deletedCourseCode;
    });
    const newAvailableCourses = this.state.availableCourses.concat({
      code: deletedCourse.code,
      nameEnglish: deletedCourse.nameEnglish,
      nameArabic: deletedCourse.nameArabic,
    });
    this.setState(() => ({
      selectedCourses: newSelectedCourses,
      availableCourses: newAvailableCourses,
    }));
  };

  onGroupClick = () => {
    document.getElementById("additional-data").style.display = "none";
    document.getElementById("group-data").style.display = "block";
  };

  onSectionClick = () => {
    document.getElementById("additional-data").style.display = "block";
    document.getElementById("group-data").style.display = "none";
  };

  onSectionNumberChange = (e) => {
    document.getElementById("sectionGroupsData").innerHTML = "";

    if (e.target.value != "") {
      const Num = parseInt(e.target.value);
      document.getElementById("sectionGroupsData").innerHTML = "";

      for (let i = 1; i <= Num; ++i) {
        const group = document.createElement("div");
        group.setAttribute("className", "form-group");
        group.innerHTML = `
          <div key=${i}>
            <label class="text-primary" style="display:block">
              Group ${i}:
            </label>
            <label class="text-secondary" style="marginRight:10px">
              Demonstrator name:
            </label>
            <input
              id="demonstrator${i}"
              type="text"
              style="margin-right:20px; border:1px solid #999; border-radius:6px;"
            ></input>
            <label class="text-secondary" style="marginRight:10px">
              day:
            </label>
            <select
              defaultValue="1"
              id="select${i}"
              class="font-weight-bold font-italic"
              style="margin-right:20px; border:1px solid #999; border-radius:6px;"
            >
              <option value="1">Saturday</option>
              <option value="2">Sunday</option>
              <option value="3">Monday</option>
              <option value="4">Tuesday</option>
              <option value="5">Wednesday</option>
              <option value="6">Thursday</option>
              <option value="7">Friday</option>
            </select>
            <label class="text-secondary" style="marginRight:10px">
              time:
            </label>
            <input
              id="time${i}"
              style="border:1px solid #999; border-radius:6px;"
              type="time"
            ></input>
          </div>
        `;

        document.getElementById("sectionGroupsData").appendChild(group);
      }
    }
  };

  onEnglishNameChange = (e) => {
    const newValue = e.target.value;
    this.setState(() => ({
      termEnglishName: newValue,
    }));
  };

  onArabicNameChange = (e) => {
    const newValue = e.target.value;
    this.setState(() => ({
      termArabicName: newValue,
    }));
  };

  render() {
    return (
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">Add Term</h1>
              </div>
              {/* /.col */}
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <NavLink to="/terms">Terms</NavLink>
                  </li>
                  <li className="breadcrumb-item">Add term</li>
                </ol>
              </div>
              {/* /.col */}
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </div>
        {/* /.content-header */}

        {/* Main content */}
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              {/* Enter Term Information */}
              <div className="col-sm-12">
                <Card className="card-warning">
                  <Card.Header variant="primary">
                    <h4>Term Information</h4>
                  </Card.Header>

                  <form role="form">
                    <Card.Body>
                      <div className="form-group">
                        <label htmlFor="TermEnglishName">
                          Term name in English:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="TermEnglishName"
                          placeholder="English name"
                          value={this.state.termEnglishName}
                          onChange={this.onEnglishNameChange}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="TermArabicName">
                          Term name in Arabic:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="TermArabicName"
                          placeholder="الاسم بالعربي"
                          value={this.state.termArabicName}
                          onChange={this.onArabicNameChange}
                        />
                      </div>

                      <div className="form-group clearfix">
                        <label style={{ display: "block" }}>Term type:</label>
                        <div
                          className="icheck-success d-inline"
                          style={{ marginRight: "5px" }}
                        >
                          <input
                            onClick={() => {
                              this.setState({ termType: "regular" });
                            }}
                            type="radio"
                            id="regularTerm"
                            name="r1"
                            defaultChecked
                          />
                          <label
                            className="text-secondary"
                            htmlFor="regularTerm"
                          >
                            Regular term
                          </label>
                        </div>
                        <div className="icheck-success d-inline">
                          <input
                            onClick={() => {
                              this.setState({ termType: "summer" });
                            }}
                            type="radio"
                            id="summerTerm"
                            name="r1"
                          />
                          <label
                            className="text-secondary"
                            htmlFor="summerTerm"
                          >
                            Summer term
                          </label>
                        </div>
                      </div>
                      {/*dates */}
                      <div className="form-group">
                        <label style={{ display: "block" }}>
                          Start and end date for the term:
                        </label>
                        <DateRangePicker
                          startDate={this.state.termStartDate} // momentPropTypes.momentObj or null,
                          startDateId="termStartDate" // PropTypes.string.isRequired,
                          endDate={this.state.termEndDate} // momentPropTypes.momentObj or null,
                          endDateId="termEndDate" // PropTypes.string.isRequired,
                          onDatesChange={({ startDate, endDate }) =>
                            this.setState({
                              termStartDate: startDate,
                              termEndDate: endDate,
                            })
                          } // PropTypes.func.isRequired,
                          focusedInput={this.state.termFocusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                          onFocusChange={(focusedInput) =>
                            this.setState({ termFocusedInput: focusedInput })
                          } // PropTypes.func.isRequired,
                        />
                      </div>

                      <div className="form-group">
                        <label style={{ display: "block" }}>
                          Start and end date for registeration period:
                        </label>
                        <DateRangePicker
                          startDate={this.state.registerStartDate} // momentPropTypes.momentObj or null,
                          startDateId="registerStartDate" // PropTypes.string.isRequired,
                          endDate={this.state.registerEndDate} // momentPropTypes.momentObj or null,
                          endDateId="registerEndDate" // PropTypes.string.isRequired,
                          onDatesChange={({ startDate, endDate }) =>
                            this.setState({
                              registerStartDate: startDate,
                              registerEndDate: endDate,
                            })
                          } // PropTypes.func.isRequired,
                          focusedInput={this.state.registerFocusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                          onFocusChange={(focusedInput) =>
                            this.setState({
                              registerFocusedInput: focusedInput,
                            })
                          } // PropTypes.func.isRequired,
                        />
                      </div>

                      <div className="form-group">
                        <label style={{ display: "block" }}>
                          Start and end date for editing period:
                        </label>
                        <DateRangePicker
                          startDate={this.state.editStartDate} // momentPropTypes.momentObj or null,
                          startDateId="editStartDate" // PropTypes.string.isRequired,
                          endDate={this.state.editEndDate} // momentPropTypes.momentObj or null,
                          endDateId="editEndDate" // PropTypes.string.isRequired,
                          onDatesChange={({ startDate, endDate }) =>
                            this.setState({
                              editStartDate: startDate,
                              editEndDate: endDate,
                            })
                          } // PropTypes.func.isRequired,
                          focusedInput={this.state.editFocusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                          onFocusChange={(focusedInput) =>
                            this.setState({ editFocusedInput: focusedInput })
                          } // PropTypes.func.isRequired,
                        />
                      </div>
                    </Card.Body>
                  </form>
                </Card>
              </div>

              {/* Select from the available courses */}
              <div className="col-sm-12">
                <Card className="card-primary">
                  <Card.Header>
                    <Card.Title>Available courses</Card.Title>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="collapse"
                        data-toggle="tooltip"
                        title="Collapse"
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                    </div>
                  </Card.Header>
                  <Card.Body style={{ maxHeight: "300px", overflowY: "auto" }}>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th style={{ width: 10 }}>Code</th>
                          <th>Course English name</th>
                          <th>Course Arabic name</th>
                          <th style={{ width: 40 }}>Add</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.availableCourses.map((course) => (
                          <tr key={course.code}>
                            <td>{course.code}</td>
                            <td>{course.nameEnglish}</td>
                            <td>{course.nameArabic}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-success"
                                data-toggle="modal"
                                data-target="#modal-lg"
                                onClick={(e) => {
                                  this.setState(() => ({
                                    currentCourse: course,
                                  }));
                                }}
                              >
                                Add
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card.Body>
                </Card>
              </div>

              {/* Show selected courses */}
              <div className="col-sm-12">
                <Card className="card-primary">
                  <Card.Header>
                    <Card.Title>Selected courses</Card.Title>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="collapse"
                        data-toggle="tooltip"
                        title="Collapse"
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th style={{ width: 10 }}>Code</th>
                          <th>Course English name</th>
                          <th>Course Arabic name</th>
                          <th style={{ width: 40 }}>Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.selectedCourses.map((course) => (
                          <tr key={course.code}>
                            <td>{course.code}</td>
                            <td>{course.nameEnglish}</td>
                            <td>{course.nameArabic}</td>
                            <td>
                              <button
                                className="btn btn-danger"
                                name={course.code}
                                onClick={this.onRemoveClick}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card.Body>
                </Card>
              </div>

              {/*submit term data */}
              <div className="col-sm-12">
                <form className="form">
                  <div className="form-group">
                    <button
                      style={{ width: "100%", height: "50px" }}
                      onClick={this.addTermData}
                      className="btn btn-success"
                    >
                      Submit data
                    </button>
                  </div>
                </form>
              </div>

              {/* Modal for course information */}
              <div className="modal fade" id="modal-lg">
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">
                        Complete course information
                      </h4>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                    {/* modal body */}
                    <div className="modal-body">
                      <form id="modal-form">
                        <div className="form-group">
                          <label className="text-primary" htmlFor="doctorName">
                            Doctor name:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="doctorName"
                            placeholder="Enter doctor name ..."
                          />
                        </div>
                        {/* radio */}
                        <div className="form-group clearfix">
                          <label
                            className="text-primary"
                            style={{ display: "block" }}
                          >
                            Course type:
                          </label>
                          <div
                            className="icheck-success d-inline"
                            style={{ marginRight: "5px" }}
                          >
                            <input
                              type="radio"
                              id="radioSuccess1"
                              name="r1"
                              onClick={this.onGroupClick}
                              defaultChecked
                            />
                            <label
                              className="text-secondary"
                              htmlFor="radioSuccess1"
                            >
                              Group
                            </label>
                          </div>
                          <div className="icheck-success d-inline">
                            <input
                              type="radio"
                              id="radioSuccess2"
                              name="r1"
                              onClick={this.onSectionClick}
                            />
                            <label
                              className="text-secondary"
                              htmlFor="radioSuccess2"
                            >
                              Section
                            </label>
                          </div>
                        </div>

                        <div className="form-group" id="group-data">
                          <div>
                            <label
                              className="text-secondary"
                              style={{ marginRight: "10px" }}
                            >
                              Demonstrator name:
                            </label>
                            <input
                              id="groupDemonstrator"
                              type="text"
                              style={{
                                marginRight: "20px",
                                border: "1px solid #999",
                                borderRadius: "6px",
                              }}
                            ></input>
                            <label
                              className="text-secondary"
                              style={{ marginRight: "10px" }}
                            >
                              day:
                            </label>
                            <select
                              defaultValue="1"
                              id="groupSelect"
                              className="font-weight-bold font-italic"
                              style={{
                                marginRight: "20px",
                                border: "1px solid #999",
                                borderRadius: "6px",
                              }}
                            >
                              <option value="1">Saturday</option>
                              <option value="2">Sunday</option>
                              <option value="3">Monday</option>
                              <option value="4">Tuesday</option>
                              <option value="5">Wednesday</option>
                              <option value="6">Thursday</option>
                              <option value="7">Friday</option>
                            </select>
                            <label
                              className="text-secondary"
                              style={{ marginRight: "10px" }}
                            >
                              time:
                            </label>
                            <input
                              id="groupTime"
                              style={{
                                border: "1px solid #999",
                                borderRadius: "6px",
                              }}
                              type="time"
                            ></input>
                          </div>
                        </div>

                        {/*section groups data if found*/}
                        <div
                          className="form-group"
                          id="additional-data"
                          style={{ display: "none" }}
                        >
                          <div className="form-group">
                            <label
                              className="text-primary"
                              htmlFor="numberOfSectionGroups"
                            >
                              Number of section groups:
                            </label>
                            <input
                              type="number"
                              defaultValue={0}
                              className="form-control"
                              id="numberOfSectionGroups"
                              placeholder="Enter number of section groups ..."
                              onChange={this.onSectionNumberChange}
                            />
                          </div>
                          <div
                            className="form-group"
                            id="sectionGroupsData"
                            style={{ maxHeight: "200px", overflowY: "auto" }}
                          ></div>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer justify-content-between">
                      <button
                        type="button"
                        className="btn btn-default"
                        data-dismiss="modal"
                      >
                        Close
                      </button>
                      <button
                        onClick={this.onSaveModalClick}
                        type="button"
                        className="btn btn-primary"
                        data-dismiss="modal"
                      >
                        Save changes
                      </button>
                    </div>
                  </div>
                  {/* /.modal-content */}
                </div>
                {/* /.modal-dialog */}
              </div>
              {/* /.modal */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
