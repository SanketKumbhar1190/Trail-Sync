import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InvoicePage = () => {
  const { id: eventId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const invoiceRef = useRef();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.jwtToken;
  const userId = user?.userId;

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await api.get(`/payments/details?userId=${userId}&eventId=${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setInvoice(response.data);
        }
      } catch (error) {
        console.error("Error fetching invoice", error);
      }
    };

    if (userId && eventId) {
      fetchInvoice();
    }
  }, [userId, eventId, token]);

  // Function to generate PDF
  const generatePDF = () => {
    const input = invoiceRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190; // Adjust as needed
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`Invoice_Event_${invoice.event.title}.pdf`);
    });
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg" ref={invoiceRef}>
        <h2 className="text-center text-primary">Invoice Details</h2>

        {invoice ? (
          <>
            <p><strong>Invoice ID:</strong> {invoice.id || "N/A"}</p>
            <p><strong>Participant Email:</strong> {invoice.user?.email || "N/A"}</p>
            <p><strong>Event Name:</strong> {invoice.event?.title || "N/A"}</p>
            <p><strong>Event Date:</strong> {invoice.event?.date || "N/A"}</p>
            <p><strong>Total Amount:</strong> ₹{invoice.amount }</p>
            <p><strong>Order Status:</strong> {invoice.orderStatus || "N/A"}</p>
            <p><strong>Phone Number:</strong> {invoice.phno || "N/A"}</p>
          </>
        ) : (
          <p>Loading invoice details...</p>
        )}
      </div>

      <div className="d-flex justify-content-center mt-3">
        <button className="btn btn-success" onClick={generatePDF}>
          <FaDownload className="me-2" /> Download Invoice (PDF)
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
