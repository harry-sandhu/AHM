const apiUrl = "https://ahmserver.vercel.app";

export const fetchConsignors = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/consignors`);
    if (!response.ok) {
      throw new Error("Failed to fetch consignors.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching consignors:", error);
    throw error;
  }
};

export const fetchConsignees = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/consignees`);
    if (!response.ok) {
      throw new Error("Failed to fetch consignees.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching consignees:", error);
    throw error;
  }
};

export const addConsignor = async (consignorName) => {
  console.log("called for consinor name", consignorName);
  try {
    const response = await fetch(`${apiUrl}/api/consignor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: consignorName }),
    });
    if (!response.ok) {
      throw new Error("Failed to add consignor.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding consignor:", error);
    throw error;
  }
};

export const addConsignee = async (consigneeName) => {
  console.log("called for consinre name");
  try {
    const response = await fetch(`${apiUrl}/api/consignee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: consigneeName }),
    });
    if (!response.ok) {
      throw new Error("Failed to add consignee.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding consignee:", error);
    throw error;
  }
};
