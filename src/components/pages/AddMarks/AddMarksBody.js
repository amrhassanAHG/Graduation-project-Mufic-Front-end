import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import readXlsxFile from "read-excel-file";
import userService from "../../../services/user.service";
import myFile from "../../../assets/Marks.xlsx";

export default class AddMarksBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
    };
  }

  onFileChange = (e) => {
    const nameLen = e.target.value.length;
    if (nameLen > 4 && e.target.value.slice(nameLen - 5, nameLen) === ".xlsx") {
      document.getElementById("labelForFile").innerHTML =
        e.target.files[0].name;

      readXlsxFile(e.target.files[0]).then((rows) => {
        const len = rows.length;
        for (let i = 1; i < len; ++i) {
          let student = {
            id:null,
            nameArabic: null,
            marks:null,
          };

          student.id = rows[i][0];
          student.nameArabic = rows[i][1];
          student.marks = rows[i][2];
          
          const newStudents = this.state.students.concat(student);
          this.setState({ students: newStudents });
        }
      });
    }
  };

  onSendData = (e) => {
    e.preventDefault();

    userService.sendData("marks", this.state.students).then(
      (response) => {
        alert("data sent successfully");
        window.location.reload();
      },
      (error) => {
        alert("data sent successfully");
        window.location.reload();
      }
    );
  };

  render() {
    return (
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">Add students Marks</h1>
              </div>
              {/* /.col */}
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">Add students Marks</li>
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
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Add marks sheet</h3>
              </div>
              {/* form start */}
              <form>
                <div className="card-body">
                  <div className="info-box">
                    <span className="info-box-icon bg-success">
                      <i className="far fa-copy"></i>
                    </span>

                    <div className="info-box-content">
                      <span className="info-box-text">
                        Download this excel sheet format to populate students marks
                      </span>
                      <div className="form-group">
                        <label htmlFor="exampleInputFile">File download</label>
                        <div className="input-group">
                          <a href={myFile} download>
                            <span className="btn btn-primary" id="">
                              Download
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                    {/* /.info-box-content */}
                  </div>
                  {/*###################################*/}

                  <div className="info-box">
                    <span className="info-box-icon bg-warning">
                      <i className="far fa-copy"></i>
                    </span>
                    <div className="info-box-content">
                      <span className="info-box-text">
                        upload excel sheet to insert students
                      </span>
                      <div className="form-group">
                        <label htmlFor="inputFile">File input</label>
                        <div className="input-group">
                          <div className="custom-file">
                            <input
                              type="file"
                              className="custom-file-input"
                              id="inputFile"
                              onChange={this.onFileChange}
                            />
                            <label
                              className="custom-file-label"
                              htmlFor="inputFile"
                              id="labelForFile"
                            >
                              Choose file
                            </label>
                          </div>
                          <div className="input-group-append">
                            <span className="input-group-text" id="">
                              Upload
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /.info-box-content */}
                </div>
                {/* /.card-body */}

                <div className="card-footer">
                  <button onClick={this.onSendData} className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </div>
    );
  }
}
