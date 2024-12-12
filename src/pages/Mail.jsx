import React, { Fragment, useContext, useState, useRef, useEffect } from 'react';
import '../static/mail.css';
import appContext from '../context/appContext';
import QRCodeStyling from 'qr-code-styling';
import { jsPDF } from 'jspdf';

function Mail() {
  const { sidebarIsCollapse } = useContext(appContext);

  const [senderDetails, setSenderDetails] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
  });
  const [receiverDetails, setReceiverDetails] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
  });
  const [uniqueCode, setUniqueCode] = useState('');
  const [generated, setGenerated] = useState(false);

  // Reference for QR code container
  const qrCodeRef = useRef();

  // Handle form input changes
  const handleSenderChange = (e) => {
    const { name, value } = e.target;
    setSenderDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleReceiverChange = (e) => {
    const { name, value } = e.target;
    setReceiverDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Generate unique code
  const generateUniqueCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit code
    setUniqueCode(code);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    generateUniqueCode();
    setGenerated(true);
  };

  // Generate PDF with receipt and QR code
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Post-Seva Receipt', 10, 10);
    doc.text(`Sender: ${senderDetails.fullName}`, 10, 20);
    doc.text(`Phone: ${senderDetails.phoneNumber}`, 10, 30);
    doc.text(`Address: ${senderDetails.address}`, 10, 40);
    doc.text(`Receiver: ${receiverDetails.fullName}`, 10, 50);
    doc.text(`Phone: ${receiverDetails.phoneNumber}`, 10, 60);
    doc.text(`Address: ${receiverDetails.address}`, 10, 70);
    doc.text(`Unique Code: ${uniqueCode}`, 10, 80);

    // Generate QR Code for the unique code
    const canvas = qrCodeRef.current.querySelector('canvas');
    if (canvas) {
      doc.addImage(canvas.toDataURL(), 'PNG', 10, 90, 50, 50);
    }

    // Save PDF
    doc.save('receipt.pdf');
  };

  // Initialize the QR code when uniqueCode is available
  const qrCode = new QRCodeStyling({
    width: 128,
    height: 128,
    data: uniqueCode,
    dotsOptions: {
      color: "#000000",
      type: "square",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.2,
    },
  });

  // Update QR code when uniqueCode changes
  useEffect(() => {
    if (uniqueCode) {
      qrCode.update({
        data: uniqueCode,
      });
      qrCodeRef.current.innerHTML = ''; // Clear previous QR code
      qrCode.append(qrCodeRef.current); // Append new QR code
    }
  }, [uniqueCode]);

  return (
    <Fragment>
      <section
        className="page mail_page">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {/* Sender Form */}
            <h3>Sender Details</h3>
            <label>
              Full Name:
              <input
                type="text"
                name="fullName"
                value={senderDetails.fullName}
                onChange={handleSenderChange}
                required
              />
            </label>
            <label>
              Phone Number:
              <input
                type="text"
                name="phoneNumber"
                value={senderDetails.phoneNumber}
                onChange={handleSenderChange}
                required
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={senderDetails.address}
                onChange={handleSenderChange}
                required
              />
            </label>

            {/* Receiver Form */}
            <h3>Receiver Details</h3>
            <label>
              Full Name:
              <input
                type="text"
                name="fullName"
                value={receiverDetails.fullName}
                onChange={handleReceiverChange}
                required
              />
            </label>
            <label>
              Phone Number:
              <input
                type="text"
                name="phoneNumber"
                value={receiverDetails.phoneNumber}
                onChange={handleReceiverChange}
                required
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={receiverDetails.address}
                onChange={handleReceiverChange}
                required
              />
            </label>

            {/* Submit Button */}
            <button type="submit">Submit</button>

            {generated && (
              <div className="receipt-container">
                <h3>Generated QR Code and Receipt</h3>
                <div ref={qrCodeRef}>
                  {/* QR code container */}
                </div>
                <button onClick={generatePDF}>Download Receipt as PDF</button>
              </div>
            )}
          </form>
        </div>
      </section>
    </Fragment>
  );
}

export default Mail;
