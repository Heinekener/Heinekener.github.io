const sheetId = "1H-tqTVqLrFPzoiVzoTaSdR7lpk5RVABJmbjA0tXp-SY"; // ใส่ Sheet ID ของคุณ
const apiKey = "AIzaSyAP8KX0thto04Ok1dFE96IIgtH2J0NeKyU"; // ใส่ API Key ของคุณ
const sheetName = "Results"; // ใส่ชื่อ Sheet ของคุณ
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

// ดึงข้อมูลจาก Google Sheets
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.values; // คืนค่าข้อมูลทั้งหมดใน Sheets
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// ประมวลผลและแสดงกราฟ
fetchData().then(rows => {
  const labels = []; // เขต/หน่วยเลือกตั้ง
  const mayorScores = []; // คะแนนนายก อบจ.
  const councilScores = []; // คะแนน ส.จ.

  rows.slice(1).forEach(row => {
    labels.push(`หน่วย ${row[0]}`); // แถวที่ 0: หน่วยเลือกตั้ง
    mayorScores.push(Number(row[1])); // แถวที่ 1: คะแนนนายก อบจ.
    councilScores.push(Number(row[2])); // แถวที่ 2: คะแนน ส.จ.
  });

  // แสดงกราฟคะแนนรวม นายก อบจ.
  new Chart(document.getElementById("mayorChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "คะแนน นายก อบจ.",
        backgroundColor: "#007bff",
        data: mayorScores
      }]
    }
  });

  // แสดงกราฟคะแนนรวม ส.จ.
  new Chart(document.getElementById("councilChart"), {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        label: "คะแนน ส.จ.",
        backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56"],
        data: councilScores
      }]
    }
  });
});
