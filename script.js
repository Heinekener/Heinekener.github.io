const sheetId = "1H-tqTVqLrFPzoiVzoTaSdR7lpk5RVABJmbjA0tXp-SY"; // Sheet ID
const apiKey = "AIzaSyAP8KX0thto04Ok1dFE96IIgtH2J0NeKyU"; // API Key
const sheetName = "Results"; // ชื่อ Sheet (ปรับตามชื่อ Sheet จริงในไฟล์ Google Sheets)
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

// ฟังก์ชันดึงข้อมูลจาก Google Sheet
async function fetchData() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // ตรวจสอบว่า API คืนข้อมูลหรือไม่
    if (!data.values || data.values.length === 0) {
      console.error("ไม่มีข้อมูลใน Google Sheet หรือ Sheet ว่าง");
      return;
    }

    // แสดงข้อมูลใน Console (รวม Header และ Rows)
    console.log("Headers:", data.values[0]); // หัวคอลัมน์
    console.log("Data Rows:", data.values.slice(1)); // แถวข้อมูล

    // เรียกฟังก์ชันประมวลผลข้อมูล
    processData(data.values);
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
  }
}

// ฟังก์ชันประมวลผลข้อมูล
function processData(data) {
  const headers = data[0]; // หัวคอลัมน์
  const rows = data.slice(1); // แถวข้อมูล (ไม่รวม Header)

  // ตรวจสอบข้อมูลแต่ละแถว
  rows.forEach((row, index) => {
    const unit = row[0]; // หน่วยเลือกตั้ง
    const district = row[1]; // เขตเลือกตั้ง
    const mayorCandidate = row[2]; // เบอร์ผู้สมัคร นายก อบจ.
    const mayorScore = parseInt(row[3], 10); // คะแนน นายก อบจ.
    const councilCandidate = row[4]; // เบอร์ผู้สมัคร ส.จ.
    const councilScore = parseInt(row[5], 10); // คะแนน ส.จ.

    // ตรวจสอบค่าที่ขาดหายหรือผิดพลาด
    if (isNaN(mayorScore) || isNaN(councilScore)) {
      console.warn(
        `ข้อมูลไม่ถูกต้องในแถวที่ ${index + 1}:`,
        row
      );
    } else {
      console.log(
        `หน่วยเลือกตั้ง: ${unit}, เขต: ${district}, นายก: ${mayorCandidate} (คะแนน: ${mayorScore}), ส.จ.: ${councilCandidate} (คะแนน: ${councilScore})`
      );
    }
  });

  // ตัวอย่างการแสดงผลรวมคะแนน นายก อบจ.
  const totalMayorScores = rows.reduce((acc, row) => {
    const score = parseInt(row[3], 10);
    return acc + (isNaN(score) ? 0 : score);
  }, 0);
  console.log(`คะแนนรวมของ นายก อบจ.: ${totalMayorScores}`);
}

// เรียกฟังก์ชันดึงข้อมูล
fetchData();
