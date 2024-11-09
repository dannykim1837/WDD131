// Initialize the number of participants
let participantCount = 1;

// Function to create a template for a new participant section
function participantTemplate(count) {
  return `
    <section class="participant${count}">
      <p>Participant ${count}</p>
      <div class="item">
        <label for="fname${count}"> First Name<span>*</span></label>
        <input id="fname${count}" type="text" name="fname${count}" required />
      </div>
      <div class="item activities">
        <label for="activity${count}">Activity #<span>*</span></label>
        <input id="activity${count}" type="text" name="activity${count}" />
      </div>
      <div class="item">
        <label for="fee${count}">Fee ($)<span>*</span></label>
        <input id="fee${count}" type="number" name="fee${count}" />
      </div>
      <div class="item">
        <label for="date${count}">Desired Date <span>*</span></label>
        <input id="date${count}" type="date" name="date${count}" />
      </div>
      <div class="item">
        <p>Grade</p>
        <select id="grade${count}">
          <option value="" disabled selected></option>
          <option value="1">1st</option>
          <option value="2">2nd</option>
          <option value="3">3rd</option>
          <option value="4">4th</option>
          <option value="5">5th</option>
          <option value="6">6th</option>
          <option value="7">7th</option>
          <option value="8">8th</option>
          <option value="9">9th</option>
          <option value="10">10th</option>
          <option value="11">11th</option>
          <option value="12">12th</option>
        </select>
      </div>
    </section>
  `;
}

// Event listener for adding a new participant
document.getElementById("add").addEventListener("click", () => {
  participantCount++;
  const newParticipantHTML = participantTemplate(participantCount);
  const addButton = document.getElementById("add");
  addButton.insertAdjacentHTML("beforebegin", newParticipantHTML);
});

// Function to calculate total fees
function totalFees() {
  let feeElements = document.querySelectorAll("[id^=fee]");
  feeElements = [...feeElements]; // Convert NodeList to Array
  return feeElements.reduce((total, fee) => total + Number(fee.value || 0), 0);
}

// Function to handle form submission
function submitForm(event) {
  event.preventDefault(); // Prevent default form submission
  const adultName = document.getElementById("adult_name").value;
  const totalFeesAmount = totalFees();

  // Create success message
  const successMessage = `
    Thank you, ${adultName}, for registering. You have registered ${participantCount} participant(s) and owe $${totalFeesAmount} in fees.
  `;
  
  // Hide the form and display the summary
  document.querySelector("form").style.display = "none";
  const summary = document.getElementById("summary");
  summary.textContent = successMessage;
  summary.classList.remove("hide");
}

// Add submit event listener to the form
document.querySelector("form").addEventListener("submit", submitForm);
