const sheetId = "1H-tqTVqLrFPzoiVzoTaSdR7lpk5RVABJmbjA0tXp-SY"; // Sheet ID
const apiKey = "AIzaSyAP8KX0thto04Ok1dFE96IIgtH2J0NeKyU"; // API Key
const sheetName = "Results"; // ชื่อ Sheet
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

async function fetchData() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.values || data.values.length === 0) {
      console.error("ไม่มีข้อมูลใน Google Sheet หรือ Sheet ว่าง");
      return;
    }

    processData(data.values);
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
  }
}

function processData(data) {
  const headers = data[0]; // หัวคอลัมน์
  const rows = data.slice(1); // แถวข้อมูล (ไม่รวม Header)

  rows.forEach((row, index) => {
    const unit = row[0]; // หน่วยเลือกตั้ง
    const district = row[1]; // เขตเลือกตั้ง
    const mayorScores = row.slice(2, 9); // คะแนนของนายก อบจ. 7 เบอร์
    const councilScores = row.slice(9, 16); // คะแนนของ สจ. 7 เบอร์

    const totalMayorScore = mayorScores.reduce((acc, score) => acc + parseInt(score || 0, 10), 0); // รวมคะแนนนายก อบจ.
    const totalCouncilScore = councilScores.reduce((acc, score) => acc + parseInt(score || 0, 10), 0); // รวมคะแนน สจ.

    console.log(`หน่วยเลือกตั้ง: ${unit}, เขต: ${district}`);
    console.log(`คะแนนรวม นายก อบจ.: ${totalMayorScore}`);
    console.log(`คะแนนรวม สจ.: ${totalCouncilScore}`);
  });
}

fetchData();
