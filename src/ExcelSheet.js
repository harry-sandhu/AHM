import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  fetchConsignors,
  fetchConsignees,
  addConsignee,
  addConsignor,
} from "./api/consingnementapi";

const ExcelSheet = () => {
  const initialData = JSON.parse(localStorage.getItem("excelData")) || [
    {
      id: 1,
      biltyNumber: "",
      date: "",
      freight: "",
      consignor: "",
      consignee: "",
      gstPaidBy: "",
    },
  ];

  // Suggestions for each column
  const [data, setData] = useState(initialData);
  const [initialBiltyNumber, setInitialBiltyNumber] = useState("");
  const [consignorSuggestions, setConsignorSuggestion] = useState([]);
  const [consigneeSuggestions, setConsigneeSuggestion] = useState([]);
  useEffect(() => {
    const getConsignors = async () => {
      try {
        const consignors = await fetchConsignors();
        setConsignorSuggestion(consignors);
      } catch (error) {
        console.error(error);
      }
    };

    getConsignors();
  }, []);
  useEffect(() => {
    const getConsignees = async () => {
      try {
        const consignors = await fetchConsignees();
        setConsigneeSuggestion(consignors);
      } catch (error) {
        console.error(error);
      }
    };

    getConsignees();
  }, []);

  const gstPaidBySuggestions = [
    "Consignor",
    "Consignee",
    "Transporter",
    "Exampted",
  ];

  useEffect(() => {
    localStorage.setItem("excelData", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    const updatedData = data.map((row) => {
      if (row.consignor && !row.gstPaidBy) {
        row.gstPaidBy = "Consignor";
      } else if (row.consignee && !row.gstPaidBy) {
        row.gstPaidBy = "Consignee";
      }
      return row;
    });

    setData(updatedData);
  }, [data]);

  useEffect(() => {
    if (initialBiltyNumber !== "") {
      const updatedData = [...data];
      updatedData.forEach((row) => {
        delete row.biltyNumber;
      });
      setData(updatedData);
    }
  }, [initialBiltyNumber]);

  const handleInputChange = (value, rowIndex, columnName) => {
    const updatedData = [...data];
    updatedData[rowIndex][columnName] = value;
    setData(updatedData);
  };

  const addRow = async () => {
    const currentRow = data[data.length - 1];

    if (!currentRow.biltyNumber) {
      alert(
        "Please fill the Bilty Number in the current row before adding a new row."
      );
      return;
    }

    try {
      const apiCalls = [];

      if (currentRow.consignor) {
        console.log("cosignor called");
        apiCalls.push(addConsignor(currentRow.consignor));
      }

      if (currentRow.consignee) {
        console.log("consignee called");
        apiCalls.push(addConsignee(currentRow.consignee));
      }

      // Execute API calls asynchronously without waiting
      Promise.allSettled(apiCalls).then((results) => {
        results.forEach((result) => {
          if (result.status === "rejected") {
            console.error("Error adding consignor/consignee:", result.reason);
          }
        });
      });

      const previousRowDate = currentRow.date;
      setData([
        ...data,
        {
          id: data.length + 1,
          biltyNumber: (parseInt(currentRow.biltyNumber) + 1).toString(),
          date: previousRowDate,
          freight: "",
          consignor: "",
          consignee: "",
          gstPaidBy: "",
        },
      ]);
    } catch (error) {
      console.error("Error adding consignor/consignee:", error);
    }
  };

  const saveAsExcel = () => {
    const dataWithFloatFreight = data.map((row) => ({
      ...row,
      freight: parseFloat(row.freight) || 0, // Convert freight to float, default to 0 if conversion fails
    }));

    const ws = XLSX.utils.json_to_sheet(dataWithFloatFreight);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "excel_sheet.xlsx");
  };

  const clearAllRows = () => {
    const newData = data.slice(0, 1);
    setData(newData);
    localStorage.setItem("excelData", JSON.stringify(newData));
  };

  return (
    <div className="overflow-x-auto  ">
      <button
        onClick={saveAsExcel}
        className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded border border-green-700"
      >
        Save as Excel
      </button>
      <button
        onClick={clearAllRows}
        className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded border border-red-700"
      >
        Clear All Rows
      </button>
      <table className="min-w-full divide-y divide-gray-200">
        {/* Table header */}
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th
              scope="col"
              className=" text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28"
            >
              Bilty Number
            </th>
            <th
              scope="col"
              className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28"
            >
              Date
            </th>
            <th
              scope="col"
              className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
            >
              Freight
            </th>
            <th
              scope="col"
              className=" text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-80"
            >
              Consignor Name
            </th>
            <th
              scope="col"
              className=" text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-80"
            >
              Consignee Name
            </th>
            <th
              scope="col"
              className=" text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28"
            >
              GST Paid By
            </th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index}>
              {/* Bilty Number Input */}
              <td className=" whitespace-nowrap w-28 ">
                <input
                  type="text"
                  value={row.biltyNumber}
                  onChange={(e) =>
                    handleInputChange(e.target.value, index, "biltyNumber")
                  }
                  className="border border-gray-300 w-28 "
                />
              </td>
              {/* Date Input */}
              <td className=" whitespace-nowrap w-28">
                <DatePicker
                  selected={row.date ? new Date(row.date) : null}
                  onChange={(date) =>
                    handleInputChange(
                      date ? date.toISOString().slice(0, 10) : "",
                      index,
                      "date"
                    )
                  }
                  className="border border-gray-300 w-28"
                  dateFormat="yyyy-MM-dd"
                />
              </td>
              {/* Freight Input */}
              <td className=" whitespace-nowrap w-20">
                <input
                  type="text"
                  value={row.freight}
                  onChange={(e) =>
                    handleInputChange(e.target.value, index, "freight")
                  }
                  className="border border-gray-300  w-20"
                />
              </td>
              {/* Consignor Name Input */}
              <td className=" whitespace-nowrap border w-80">
                <input
                  type="text"
                  value={row.consignor}
                  onChange={(e) =>
                    handleInputChange(e.target.value, index, "consignor")
                  }
                  className="border border-gray-300 w-80 "
                  list="consignorSuggestions"
                />
                <datalist id="consignorSuggestions">
                  {consignorSuggestions.map((suggestion, i) => (
                    <option key={i} value={suggestion} />
                  ))}
                </datalist>
              </td>
              {/* Consignee Name Input */}
              <td className=" whitespace-nowrap border w-80">
                <input
                  type="text"
                  value={row.consignee}
                  onChange={(e) =>
                    handleInputChange(e.target.value, index, "consignee")
                  }
                  className="border border-gray-300 w-80  "
                  list="consigneeSuggestions"
                />
                <datalist id="consigneeSuggestions">
                  {consigneeSuggestions.map((suggestion, i) => (
                    <option key={i} value={suggestion} />
                  ))}
                </datalist>
              </td>
              {/* GST Paid By Input */}
              <td className="whitespace-nowrap border w-28">
                <input
                  type="text"
                  value={row.gstPaidBy}
                  onChange={(e) =>
                    handleInputChange(e.target.value, index, "gstPaidBy")
                  }
                  className="border border-gray-300  w-28 "
                  list="gstPaidBySuggestions"
                />
                <datalist id="gstPaidBySuggestions">
                  {gstPaidBySuggestions.map((suggestion, i) => (
                    <option key={i} value={suggestion} />
                  ))}
                </datalist>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Buttons */}
      <div className="">
        <button
          onClick={addRow}
          className="mt-4 mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border border-blue-700"
        >
          Add Row
        </button>
        <div className="pb-96"></div>
      </div>
    </div>
  );
};

export default ExcelSheet;
