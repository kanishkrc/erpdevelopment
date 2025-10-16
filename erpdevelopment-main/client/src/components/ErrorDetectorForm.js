import React, { useState, useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "../styles/ErrorDetectorForm.css";

const ErrorDetectorForm = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const hasCheckedAuth = useRef(false);
  const [formData, setFormData] = useState({
    srfNo: "",
    date: "",
    probableDate: "",
    organization: "",
    address: "",
    contactPerson: "",
    mobileNumber: "",
    telephoneNumber: "",
    emailId: "",
  });

  const [tableRows, setTableRows] = useState([
    {
      jobNo: "",
      instrumentDescription: "",
      serialNo: "",
      parameter: "",
      ranges: "",
      accuracy: "",
    },
  ]);

  // Default empty row
  const emptyRow = {
    jobNo: "",
    instrumentDescription: "",
    serialNo: "",
    parameter: "",
    ranges: "",
    accuracy: "",
  };

 
  useEffect(() => {

    if (hasCheckedAuth.current) return; 
    hasCheckedAuth.current = true;
    fetch("/isloggedin")
      .then((res) => res.json())
      .then((data) => {
        if (!data.isLoggedIn) {
         
          alert("Please sign in first to access this page.");
          navigate("/"); 
        } else {
          setIsAuthenticated(true); 
        }
      })
      .catch((err) => {
        console.error("Error checking login status:", err);
        navigate("/"); 
      });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const requestData = { ...formData, products: tableRows };

    console.log("Submitting form data:", JSON.stringify(requestData, null, 2));

    fetch("/errorform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then((data) => {
        console.log("Response from backend:", data);

        // Reset the form after submission
        setFormData({
            srfNo: "",
            date: "",
            probableDate: "",
            organization: "",
            address: "",
            contactPerson: "",
            mobileNumber: "",
            telephoneNumber: "",
            emailId: "",
        });

        setTableRows([
            {
                jobNo: "",
                instrumentDescription: "",
                serialNo: "",
                parameter: "",
                ranges: "",
                accuracy: "",
            }
        ]);

        if (data.redirectURL) {
            console.log(`Redirecting to: ${data.redirectURL}`);
            navigate(data.redirectURL);
        } else {
            alert("Form submitted successfully, but no redirect URL received.");
        }
    })
    .catch((err) => console.error("Error submitting form:", err));
};

  // Prevent rendering the form until authentication check is complete
  if (isAuthenticated === null) return null;

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-header-logo">
          <div className="logo">ED</div>
          <h1>ERROR DETECTOR</h1>
        </div>

        <div className="service-request-header">
          <h2>SERVICE REQUEST FORM (SRF)</h2>
        </div>

        <div className="form-top-section">
          <div className="form-group">
            <label>SRF No:</label>
            <input  type="text"
  value={formData.srfNo}
  onChange={(e) => setFormData({ ...formData, srfNo: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Probable Date of Completion:</label>
            <input
              type="date"
              value={formData.probableDate}
              onChange={(e) => setFormData({ ...formData, probableDate: e.target.value })}
            />
            <span className="note">(for office use only)</span>
          </div>
        </div>

        <div className="main-content">
          <div className="section-1">
            <h3>1. Details of Organization:</h3>
            <div className="org-details">
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={formData.organization} 
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}/>
              </div>
              <div className="form-group">
                <label>Address:</label>
                <textarea value={formData.address} 
                onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
              <div className="contact-details">
                <div className="form-group">
                  <label>Contact Person Name:</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPerson: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Mobile Number:</label>
                  <input type="tel" value={formData.mobileNumber} 
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Telephone Number:</label>
                  <input
                    type="tel"
                    value={formData.telephoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, telephoneNumber: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Email ID:</label>
                  <input
                    type="email"
                    value={formData.emailId}
                    onChange={(e) =>
                      setFormData({ ...formData, emailId: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="section-2">
            <h3>2. Product Description:</h3>
            <div className="product-table">
              <table>
                <thead>
                  <tr>
                    <th>Job No.</th>
                    <th>Instrument Description</th>
                    <th>Serial No./ID No.</th>
                    <th>Parameter</th>
                    <th>Ranges</th>
                    <th>Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, index) => (
                    <tr key={index}>
                      {Object.keys(emptyRow).map((key) => (
                        <td key={key}>
                          <input
                            type="text"
                            value={row[key]}
                            onChange={(e) =>
                              setTableRows((prevRows) =>
                                prevRows.map((r, i) =>
                                  i === index ? { ...r, [key]: e.target.value } : r
                                )
                              )
                            }
                            style={{ width: "160px", padding: "5px", fontSize: "12px" }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" onClick={() => setTableRows([...tableRows, emptyRow])} className="add-row-btn">
                Add Row
              </button>
            </div>
          </div>

          <div className="section-3">
            <h3>3. Decision Rules</h3>
            <div className="checkbox-group">
              <input type="checkbox" id="rule1" name="rule1" />
              <label htmlFor="rule1">No decision on conformative statement</label>
            </div>
            <div className="checkbox-group">
              <input type="checkbox" id="rule2" name="rule2" />
              <label htmlFor="rule2">Simple conformative decision</label>
            </div>
          </div>

          <div className="form-footer">
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ErrorDetectorForm;
