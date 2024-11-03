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

  const [data, setData] = useState(initialData);
  const [initialBiltyNumber, setInitialBiltyNumber] = useState("");
  const [consignorSuggestions, setConsignorSuggestion] = useState([]);
  const [consigneeSuggestions, setConsigneeSuggestion] = useState([]);
  const [filteredConsignorSuggestions, setFilteredConsignorSuggestions] =
    useState([]);
  const [filteredConsigneeSuggestions, setFilteredConsigneeSuggestions] =
    useState([]);

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
        const consignees = await fetchConsignees();
        setConsigneeSuggestion(consignees);
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
    "Exempted",
  ];

  useEffect(() => {
    localStorage.setItem("excelData", JSON.stringify(data));
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

    if (columnName === "consignor" || columnName === "consignee") {
      if (updatedData[rowIndex].consignor && !updatedData[rowIndex].consignee) {
        updatedData[rowIndex].gstPaidBy = "Consignor";
      } else if (
        updatedData[rowIndex].consignee &&
        !updatedData[rowIndex].consignor
      ) {
        updatedData[rowIndex].gstPaidBy = "Consignee";
      } else if (
        !updatedData[rowIndex].consignor &&
        !updatedData[rowIndex].consignee
      ) {
        updatedData[rowIndex].gstPaidBy = ""; // Clear the GST Paid By if both are empty
      }
    }

    setData(updatedData);

    if (columnName === "consignor") {
      setFilteredConsignorSuggestions(
        consignorSuggestions.filter((suggestion) =>
          suggestion.toLowerCase().startsWith(value.toLowerCase())
        )
      );
    }

    if (columnName === "consignee") {
      setFilteredConsigneeSuggestions(
        consigneeSuggestions.filter((suggestion) =>
          suggestion.toLowerCase().startsWith(value.toLowerCase())
        )
      );
    }
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

      if (
        currentRow.consignor &&
        !consignorSuggestions.includes(currentRow.consignor)
      ) {
        console.log("Consignor called");
        apiCalls.push(addConsignor(currentRow.consignor));
      }

      if (
        currentRow.consignee &&
        !consigneeSuggestions.includes(currentRow.consignee)
      ) {
        console.log("Consignee called");
        apiCalls.push(addConsignee(currentRow.consignee));
      }

      // Execute API calls asynchronously without waiting
      const results = await Promise.allSettled(apiCalls);
      results.forEach((result) => {
        if (result.status === "rejected") {
          console.error("Error adding consignor/consignee:", result.reason);
        }
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
      freight: parseFloat(row.freight) || 0,
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
    <div className="overflow-x-auto">
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
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index}>
              <td className=" whitespace-nowrap w-28 ">
                <input
                  type="number"
                  value={row.biltyNumber}
                  onChange={(e) =>
                    handleInputChange(e.target.value, index, "biltyNumber")
                  }
                  className="border border-gray-300 w-28 "
                />
              </td>
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
              <td className=" whitespace-nowrap w-20">
                <input
                  type="number"
                  value={row.freight}
                  onChange={(e) =>
                    handleInputChange(e.target.value, index, "freight")
                  }
                  className="border border-gray-300  w-20"
                />
              </td>
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
                  {filteredConsignorSuggestions.map((suggestion, i) => (
                    <option key={i} value={suggestion} />
                  ))}
                </datalist>
              </td>
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
                  {filteredConsigneeSuggestions.map((suggestion, i) => (
                    <option key={i} value={suggestion} />
                  ))}
                </datalist>
              </td>
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
