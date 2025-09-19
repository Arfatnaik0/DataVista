let chart;
const ctx = document.getElementById('myChart').getContext('2d');

// Initial chart with demo data
function renderChart(type, labels, datasets) {
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type,
    data: { labels, datasets },
    options: { responsive: true, plugins: { legend: { position: 'top' } } }
  });
}

// Demo data fallback
renderChart("bar",
  ["2019", "2020", "2021", "2022"],
  [
    { label: "Sales", data: [120, 150, 180, 200], backgroundColor: "orange" },
    { label: "Profit", data: [30, 45, 60, 70], backgroundColor: "green" }
  ]
);

// Handle file uploads
document.getElementById("fileInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.name.endsWith(".json")) {
    file.text().then(text => {
      const json = JSON.parse(text);
      renderChart(
        document.getElementById("chartType").value,
        json.labels,
        json.datasets.map(ds => ({
          label: ds.label,
          data: ds.data,
          backgroundColor: randomColor()
        }))
      );
    });
  }

  if (file.name.endsWith(".csv")) {
    file.text().then(text => {
      const rows = text.trim().split("\n").map(r => r.split(","));
      const labels = rows.slice(1).map(r => r[0]);
      const datasets = [];

      for (let col = 1; col < rows[0].length; col++) {
        datasets.push({
          label: rows[0][col],
          data: rows.slice(1).map(r => Number(r[col])),
          backgroundColor: randomColor()
        });
      }

      renderChart(document.getElementById("chartType").value, labels, datasets);
    });
  }
});

// Change chart type dynamically
document.getElementById("chartType").addEventListener("change", () => {
  if (!chart) return;
  chart.config.type = document.getElementById("chartType").value;
  chart.update();
});

// Random color generator
function randomColor() {
  return `hsl(${Math.floor(Math.random()*360)}, 70%, 60%)`;
}


home=document.getElementById("home");

home.addEventListener("click",()=>{
    document.querySelector(".hero").style.display = "flex";
    document.querySelector(".main").style.display = "none";
    document.querySelector(".wrapper").style.display = "block";
    document.querySelector(".about_us").style.display = "block";
});

trynow=document.getElementById("tryNow");

trynow.addEventListener("click",()=>{
    document.querySelector(".hero").style.display = "none";
    document.querySelector(".main").style.display = "flex";
    document.querySelector(".wrapper").style.display = "none";
    document.querySelector(".about_us").style.display = "none";
});

demo=document.querySelector('.btn-outline');

demo.addEventListener("click",()=>{
    document.querySelector(".hero").style.display = "none";
    document.querySelector(".main").style.display = "flex";
    document.querySelector(".wrapper").style.display = "none";
    document.querySelector(".about_us").style.display = "none";
});

