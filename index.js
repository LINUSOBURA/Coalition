$(document).ready(function () {
  const decoded_key = atob("Y29hbGl0aW9uOnNraWxscy10ZXN0");
  fetch("https://fedskillstest.coalitiontechnologies.workers.dev", {
    method: "GET",
    headers: {
      Authorization: `Basic ${btoa(decoded_key)}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      new_data = data;

      for (item in new_data) {
        $(".patients-list").append(
          `<div class="patient">
		  <div class="patient-profile">
		  <img src="${new_data[item].profile_picture}">
		  <p><b>${new_data[item].name}</b> <br> ${new_data[item].gender}, ${new_data[item].age}</p>
		  </div>
		  <img class="more-horiz" src="images/more_horiz_FILL0_wght300_GRAD0_opsz24.svg" alt="more horizontal">
		  </div>`
        );
      }

      for (item in new_data) {
        if (new_data[item].name === "Jessica Taylor") {
          $(".patient-info").append(
            `<div class="single-patient">
				<img src="${new_data[item].profile_picture}">
				<h5>${new_data[item].name}</h5>
				<div class="patient-details">
				<div class="info"> <img src="images/BirthIcon.svg"> <p>Date of Birth <br> <b>${formatDate(
          new_data[item].date_of_birth
        )}</b></p> </div>
				<div class="info"> <img src="images/FemaleIcon.svg"> <p>Gender <br> <b>${
          new_data[item].gender
        }</b></p> </div>
				<div class="info"> <img src="images/PhoneIcon.svg"> <p>Contact Info <br> <b>${
          new_data[item].phone_number
        }</b></p> </div>
				<div class="info"> <img src="images/PhoneIcon.svg"> <p>Emergency Contacts <br> <b>${
          new_data[item].emergency_contact
        }</b></p> </div>
				<div class="info"> <img src="images/InsuranceIcon.svg"> <p>Insurance Provider <br> <b>${
          new_data[item].insurance_type
        }</b></p> </div>
				</div>
        <div class='all-information'>show all information</div>
				</div>`
          );

          for (result in new_data[item].lab_results) {
            $(".lab-results").append(
              `<div class="lab-result">
			<p>${new_data[item].lab_results[result]}</p>
			<img src="images/download_FILL0_wght300_GRAD0_opsz24 (1).svg" alt="download">
			</div>`
            );
          }

          for (result in new_data[item].diagnostic_list) {
            $(".diagnostic-items").append(
              `<tr class="diagnosis-item">
				<td>${new_data[item].diagnostic_list[result].name}</td>
				<td>${new_data[item].diagnostic_list[result].description}</td>
				<td>${new_data[item].diagnostic_list[result].status}</td>
				</tr>`
            );
          }

          $(".respiratory-info").append(
            `<p>Respiratory Rate <br> <span>${new_data[item].diagnosis_history[0].respiratory_rate.value} bpm</span></p>
			<p>${new_data[item].diagnosis_history[0].respiratory_rate.levels}</p>`
          );

          $(".temperature-info").append(
            `<p>Temperature <br> <span>${new_data[item].diagnosis_history[0].temperature.value}&deg F</span></p>
			<p>${new_data[item].diagnosis_history[0].temperature.levels}</p>`
          );

          $(".heartrate-info").append(
            `<p>Heart Rate <br> <span>${new_data[item].diagnosis_history[0].heart_rate.value} bpm</span></p>
			<p><img src="images/ArrowDown.svg" alt="Arrow">${new_data[item].diagnosis_history[0].heart_rate.levels}</p>`
          );

          const chart_data = new_data[item].diagnosis_history
            .slice(0, 6)
            .reverse();

          const labels = chart_data.map(
            (item) => `${item.month}, ${item.year}`
          );
          const systolicData = chart_data.map(
            (item) => item.blood_pressure.systolic.value
          );
          const diastolicData = chart_data.map(
            (item) => item.blood_pressure.diastolic.value
          );
          const maxSystolic = Math.max(...systolicData);
          const minDiastolic = Math.min(...diastolicData);

          const ctx = $("#bloodPressure").get(0).getContext("2d");
          const bloodPressure = new Chart(ctx, {
            type: "line",
            data: {
              labels: labels,
              datasets: [
                {
                  data: systolicData,
                  borderColor: "#C26EB4",
                  backgroundColor: "#E66FD2",
                  borderWidth: 1,
                  fill: false,
                  tension: 0.3,
                },
                {
                  data: diastolicData,
                  borderColor: "#7E6CAB",
                  backgroundColor: "#8C6FE6",
                  borderWidth: 1,
                  fill: false,
                  tension: 0.3,
                },
              ],
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  beginAtZero: false,
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
            },
          });

          $("#systolic-value").append(`${maxSystolic}`);
          for (let item of chart_data) {
            if (item.blood_pressure.systolic.value == maxSystolic) {
              const maxSystolicLevels = item.blood_pressure.systolic.levels;
              $("#systolic-levels").append(`${maxSystolicLevels}`);
            }
          }

          $("#diastolic-value").append(`${minDiastolic}`);
          for (let item of chart_data) {
            if (item.blood_pressure.diastolic.value == minDiastolic) {
              const minDiastolicLevels = item.blood_pressure.diastolic.levels;
              $("#diastolic-levels").append(`${minDiastolicLevels}`);
            }
          }
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  }
});
