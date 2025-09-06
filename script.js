  document.addEventListener("DOMContentLoaded", function () {
    // Initialize jsPDF
    const { jsPDF } = window.jspdf;

    // DOM Elements
    const loginContainer = document.getElementById("login-container");
    const appContainer = document.getElementById("app-container");
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const showRegisterBtn = document.getElementById("show-register");
    const setAlarmBtn = document.getElementById("set-alarm-btn");
    const testAlarmBtn = document.getElementById("test-alarm-btn");
    const exportPdfBtn = document.getElementById("export-pdf-btn");
    const userNameSpan = document.getElementById("user-name");
    const hamburgerMenu = document.getElementById("hamburger-menu");
    const navLinks = document.getElementById("nav-links");
    const frequencyDaily = document.getElementById("frequency-daily");
    const frequencyWeekly = document.getElementById("frequency-weekly");
    const frequencyMonthly = document.getElementById("frequency-monthly");
    const targetLabel = document.getElementById("target-label");
    const durationLabel = document.getElementById("duration-label");
    const tableHeader = document.getElementById("table-header");
    const durationInput = document.getElementById("duration");

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("savingsUserLoggedIn") === "true";

    if (isLoggedIn) {
      const userData = JSON.parse(
        localStorage.getItem("savingsUserData") || "{}"
      );
      userNameSpan.textContent = userData.name || "User";
      showApp();
    }

    // Hamburger menu toggle
    hamburgerMenu.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });

    // Frequency change handler
    frequencyDaily.addEventListener("change", updateFrequency);
    frequencyWeekly.addEventListener("change", updateFrequency);
    frequencyMonthly.addEventListener("change", updateFrequency);

    function updateFrequency() {
      if (frequencyDaily.checked) {
        targetLabel.textContent = "Daily Target:";
        durationLabel.textContent = "Duration (days):";
        durationInput.value = 30; // Default to 30 days for daily plan
      } else if (frequencyWeekly.checked) {
        targetLabel.textContent = "Weekly Target:";
        durationLabel.textContent = "Duration (weeks):";
        durationInput.value = 12; // 12 weeks for weekly plan
      } else {
        targetLabel.textContent = "Monthly Target:";
        durationLabel.textContent = "Duration (months):";
        durationInput.value = 6; // 6 months for monthly plan
      }
      updateTableHeaders();
    }

    function updateTableHeaders() {
      if (frequencyDaily.checked) {
        tableHeader.innerHTML = `
                          <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Target</th>
                            <th>Saved?</th>
                            <th>Actual</th>
                            <th>Cumulative</th>
                            <th>Notes</th>
                          </tr>
                        `;
      } else if (frequencyWeekly.checked) {
        tableHeader.innerHTML = `
                          <tr>
                            <th>Week</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Target</th>
                            <th>Saved?</th>
                            <th>Actual</th>
                            <th>Cumulative</th>
                            <th>Notes</th>
                          </tr>
                        `;
      } else {
        tableHeader.innerHTML = `
                          <tr>
                            <th>Month</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Target</th>
                            <th>Saved?</th>
                            <th>Actual</th>
                            <th>Cumulative</th>
                            <th>Notes</th>
                          </tr>
                        `;
      }
    }

    // Login functionality
    loginBtn.addEventListener("click", function () {
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      if (email && password) {
        // In a real app, this would verify credentials with a server
        const userData = {
          email: email,
          name: email.split("@")[0], // Simple name extraction from email
        };

        localStorage.setItem("savingsUserLoggedIn", "true");
        localStorage.setItem("savingsUserData", JSON.stringify(userData));

        userNameSpan.textContent = userData.name;
        showApp();
        showNotification("Login successful!");
      } else {
        showNotification("Please enter both email and password");
      }
    });

    // Logout functionality
    logoutBtn.addEventListener("click", function () {
      localStorage.setItem("savingsUserLoggedIn", "false");
      showLogin();
      showNotification("Logged out successfully");
    });

    // Show register form (simplified)
    showRegisterBtn.addEventListener("click", function (e) {
      e.preventDefault();
      showNotification("Registration would be implemented in a real app");
    });

    // PDF Export functionality
    exportPdfBtn.addEventListener("click", function () {
      generatePDF();
    });

    // Navigation links
    document
      .getElementById("nav-summary")
      .addEventListener("click", function (e) {
        e.preventDefault();
        document
          .querySelector(".summary")
          .scrollIntoView({ behavior: "smooth" });
        navLinks.classList.remove("active");
      });

    document
      .getElementById("nav-export")
      .addEventListener("click", function (e) {
        e.preventDefault();
        document
          .querySelector(".export-section")
          .scrollIntoView({ behavior: "smooth" });
        navLinks.classList.remove("active");
      });

    // Show/hide functions
    function showApp() {
      loginContainer.classList.add("hidden");
      appContainer.classList.remove("hidden");
      initializeApp();
    }

    function showLogin() {
      appContainer.classList.add("hidden");
      loginContainer.classList.remove("hidden");
    }

    // Notification function
    function showNotification(message) {
      const notification = document.createElement("div");
      notification.className = "notification";
      notification.textContent = message;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000);
    }

    // PDF Generation function - UPDATED TO INCLUDE USER NAME
    function generatePDF() {
      const isWeekly = frequencyWeekly.checked;
      const isMonthly = frequencyMonthly.checked;
      const doc = new jsPDF();

      // Get user's name from localStorage
      const userData = JSON.parse(
        localStorage.getItem("savingsUserData") || "{}"
      );
      const userName = userData.name || "User";

      // Add title
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);

      let frequencyText = "Daily";
      if (isWeekly) frequencyText = "Weekly";
      if (isMonthly) frequencyText = "Monthly";

      doc.text(`${frequencyText} Savings Tracker`, 105, 15, {
        align: "center",
      });

      // Add user's name
      doc.setFontSize(14);
      doc.setTextColor(60, 60, 60);
      doc.text(`Report for: ${userName}`, 105, 25, { align: "center" });

      // Add date
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 32, {
        align: "center",
      });

      // Add summary section
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text("Summary", 14, 45);

      // Add summary values
      const totalTarget = document.getElementById("total-target").textContent;
      const totalSaved = document.getElementById("total-saved").textContent;
      const progress = document.getElementById("progress-percent").textContent;

      doc.setFontSize(12);
      doc.text(`Total Target: ${totalTarget}`, 14, 55);
      doc.text(`Total Saved: ${totalSaved}`, 14, 65);
      doc.text(`Progress: ${progress}`, 14, 75);

      // Add table
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text("Savings Details", 14, 90);

      // Prepare table data
      let tableColumn, tableRows;

      if (isWeekly) {
        tableColumn = [
          "Week",
          "Start Date",
          "End Date",
          "Target",
          "Saved",
          "Actual",
          "Cumulative",
          "Notes",
        ];
        tableRows = [];

        const rows = document.querySelectorAll("#savings-table tr");
        rows.forEach((row) => {
          const rowData = [];
          const cols = row.querySelectorAll("td");

          if (cols.length >= 8) {
            // Week
            rowData.push(cols[0].textContent);

            // Start Date
            rowData.push(cols[1].textContent);

            // End Date
            rowData.push(cols[2].textContent);

            // Target
            rowData.push(cols[3].textContent);

            // Saved
            const savedCheckbox = cols[4].querySelector(
              'input[type="checkbox"]'
            );
            rowData.push(savedCheckbox.checked ? "Yes" : "No");

            // Actual
            rowData.push(cols[5].textContent);

            // Cumulative
            rowData.push(cols[6].textContent);

            // Notes
            const notesInput = cols[7].querySelector('input[type="text"]');
            rowData.push(notesInput.value);

            tableRows.push(rowData);
          }
        });
      } else if (isMonthly) {
        tableColumn = [
          "Month",
          "Start Date",
          "End Date",
          "Target",
          "Saved",
          "Actual",
          "Cumulative",
          "Notes",
        ];
        tableRows = [];

        const rows = document.querySelectorAll("#savings-table tr");
        rows.forEach((row) => {
          const rowData = [];
          const cols = row.querySelectorAll("td");

          if (cols.length >= 8) {
            // Month
            rowData.push(cols[0].textContent);

            // Start Date
            rowData.push(cols[1].textContent);

            // End Date
            rowData.push(cols[2].textContent);

            // Target
            rowData.push(cols[3].textContent);

            // Saved
            const savedCheckbox = cols[4].querySelector(
              'input[type="checkbox"]'
            );
            rowData.push(savedCheckbox.checked ? "Yes" : "No");

            // Actual
            rowData.push(cols[5].textContent);

            // Cumulative
            rowData.push(cols[6].textContent);

            // Notes
            const notesInput = cols[7].querySelector('input[type="text"]');
            rowData.push(notesInput.value);

            tableRows.push(rowData);
          }
        });
      } else {
        tableColumn = [
          "Date",
          "Day",
          "Target",
          "Saved",
          "Actual",
          "Cumulative",
          "Notes",
        ];
        tableRows = [];

        const rows = document.querySelectorAll("#savings-table tr");
        rows.forEach((row) => {
          const rowData = [];
          const cols = row.querySelectorAll("td");

          if (cols.length >= 7) {
            // Date
            rowData.push(cols[0].textContent);

            // Day
            rowData.push(cols[1].textContent);

            // Target
            rowData.push(cols[2].textContent);

            // Saved
            const savedCheckbox = cols[3].querySelector(
              'input[type="checkbox"]'
            );
            rowData.push(savedCheckbox.checked ? "Yes" : "No");

            // Actual
            rowData.push(cols[4].textContent);

            // Cumulative
            rowData.push(cols[5].textContent);

            // Notes
            const notesInput = cols[6].querySelector('input[type="text"]');
            rowData.push(notesInput.value);

            tableRows.push(rowData);
          }
        });
      }

      // Generate the PDF table
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 100,
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [52, 152, 219],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
      });

      // Add footer with page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Page ${i} of ${pageCount}`,
          105,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }

      // Save the PDF
      doc.save("savings-tracker-report.pdf");
      showNotification("PDF exported successfully!");
    }

    // Alarm/reminder functionality
    let alarmInterval = null;

    setAlarmBtn.addEventListener("click", function () {
      const alarmTime = document.getElementById("alarm-time").value;
      const alarmFrequency = document.getElementById("alarm-frequency").value;

      if (alarmTime) {
        // Clear any existing alarm
        if (alarmInterval) {
          clearInterval(alarmInterval);
        }

        // Save alarm time to localStorage
        localStorage.setItem("savingsAlarmTime", alarmTime);
        localStorage.setItem("savingsAlarmFrequency", alarmFrequency);

        // Set new alarm check interval
        alarmInterval = setInterval(function () {
          checkAlarm(alarmTime, alarmFrequency);
        }, 60000); // Check every minute

        showNotification(
          `Reminder set for ${formatTime(alarmTime)} (${alarmFrequency})`
        );
      }
    });

    testAlarmBtn.addEventListener("click", function () {
      triggerAlarm();
    });

    function checkAlarm(alarmTime, alarmFrequency) {
      const now = new Date();
      const currentTime = formatTime(now);

      if (currentTime === alarmTime) {
        // Check if it's the right day for the frequency
        const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
        const dayOfMonth = now.getDate(); // 1-31
        const shouldTrigger =
          alarmFrequency === "daily" ||
          (alarmFrequency === "weekly" && dayOfWeek === 0) || // Sunday
          (alarmFrequency === "monthly" && dayOfMonth === 1); // 1st of month

        if (shouldTrigger) {
          triggerAlarm();
        }
      }
    }

    function triggerAlarm() {
      // Check if the browser supports notifications
      if (!("Notification" in window)) {
        showNotification("This browser does not support notifications");
        return;
      }

      // Request permission if not already granted
      if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            createNotification();
          }
        });
      } else if (Notification.permission === "granted") {
        createNotification();
      }

      // Also show an in-app notification
      const frequency = frequencyMonthly.checked
        ? "monthly"
        : frequencyWeekly.checked
        ? "weekly"
        : "daily";
      let message = "Reminder: Don't forget to save today! 💰";
      if (frequency === "weekly")
        message = "Reminder: Don't forget to save this week! 💰";
      if (frequency === "monthly")
        message = "Reminder: Don't forget to save this month! 💰";

      showNotification(message);
    }

    function createNotification() {
      const frequency = frequencyMonthly.checked
        ? "monthly"
        : frequencyWeekly.checked
        ? "weekly"
        : "daily";
      const notification = new Notification("Savings Reminder", {
        body: `Don't forget to save this ${
          frequency === "monthly"
            ? "month"
            : frequency === "weekly"
            ? "week"
            : "today"
        }! Track your progress in the Savings Tracker.`,
        icon: "./waving-hand-svgrepo-com.svg", // Would be a real icon in production
      });

      setTimeout(() => {
        notification.close();
      }, 5000);
    }

    function formatTime(date) {
      if (typeof date === "string") {
        return date; // Already in HH:MM format
      }

      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }

    // Load saved alarm time if exists
    const savedAlarmTime = localStorage.getItem("savingsAlarmTime");
    const savedAlarmFrequency = localStorage.getItem("savingsAlarmFrequency");
    if (savedAlarmTime) {
      document.getElementById("alarm-time").value = savedAlarmTime;
    }
    if (savedAlarmFrequency) {
      document.getElementById("alarm-frequency").value = savedAlarmFrequency;
    }

    // Original app functionality with persistence
    function initializeApp() {
      // Set default start date to today
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];
      document.getElementById("start-date").value = formattedDate;

      // Load saved data if available
      const savedData = localStorage.getItem("savingsData");
      let dailyTarget =
        parseFloat(document.getElementById("daily-target").value) || 0;
      let startDate = document.getElementById("start-date").value;
      let duration = parseInt(document.getElementById("duration").value) || 30;
      let frequency = localStorage.getItem("savingsFrequency") || "daily";

      if (savedData) {
        const data = JSON.parse(savedData);
        dailyTarget = data.dailyTarget || dailyTarget;
        startDate = data.startDate || startDate;
        duration = data.duration || duration;
        frequency = data.frequency || frequency;

        document.getElementById("daily-target").value = dailyTarget;
        document.getElementById("start-date").value = startDate;
        document.getElementById("duration").value = duration;

        if (frequency === "weekly") {
          frequencyWeekly.checked = true;
          frequencyDaily.checked = false;
          frequencyMonthly.checked = false;
          targetLabel.textContent = "Weekly Target:";
          durationLabel.textContent = "Duration (weeks):";
        } else if (frequency === "monthly") {
          frequencyMonthly.checked = true;
          frequencyDaily.checked = false;
          frequencyWeekly.checked = false;
          targetLabel.textContent = "Monthly Target:";
          durationLabel.textContent = "Duration (months):";
        } else {
          frequencyDaily.checked = true;
          frequencyWeekly.checked = false;
          frequencyMonthly.checked = false;
          targetLabel.textContent = "Daily Target:";
          durationLabel.textContent = "Duration (days):";
        }

        updateTableHeaders();
      }

      // Generate the initial plan
      generatePlan();

      // If we have saved data, load it
      if (savedData) {
        loadSavedData(JSON.parse(savedData));
      }

      // Event listeners
      document
        .getElementById("generate-btn")
        .addEventListener("click", generatePlan);
      document
        .getElementById("daily-target")
        .addEventListener("change", function () {
          generatePlan();
          saveData();
        });
      document
        .getElementById("start-date")
        .addEventListener("change", function () {
          generatePlan();
          saveData();
        });
      document
        .getElementById("duration")
        .addEventListener("change", function () {
          generatePlan();
          saveData();
        });

      function generatePlan() {
        const isWeekly = frequencyWeekly.checked;
        const isMonthly = frequencyMonthly.checked;
        const dailyTarget =
          parseFloat(document.getElementById("daily-target").value) || 0;
        const startDateValue = document.getElementById("start-date").value;
        const duration =
          parseInt(document.getElementById("duration").value) ||
          (isWeekly ? 12 : isMonthly ? 6 : 30);
        const startDate = new Date(startDateValue);
        const tableBody = document.getElementById("savings-table");

        // Clear existing rows
        tableBody.innerHTML = "";

        let cumulative = 0;
        let totalTarget = 0;
        let totalSaved = 0;

        if (isWeekly) {
          // Generate weekly plan
          for (let week = 1; week <= duration; week++) {
            const weekStartDate = new Date(startDate);
            weekStartDate.setDate(startDate.getDate() + (week - 1) * 7);

            const weekEndDate = new Date(weekStartDate);
            weekEndDate.setDate(weekStartDate.getDate() + 6);

            const weekStartStr = formatDate(weekStartDate);
            const weekEndStr = formatDate(weekEndDate);
            const weeklyTarget = dailyTarget;

            const row = document.createElement("tr");

            // Week cell
            const weekCell = document.createElement("td");
            weekCell.textContent = week;
            row.appendChild(weekCell);

            // Start Date cell
            const startDateCell = document.createElement("td");
            startDateCell.textContent = weekStartStr;
            row.appendChild(startDateCell);

            // End Date cell
            const endDateCell = document.createElement("td");
            endDateCell.textContent = weekEndStr;
            row.appendChild(endDateCell);

            // Target cell
            const targetCell = document.createElement("td");
            targetCell.textContent = `$${weeklyTarget.toFixed(2)}`;
            row.appendChild(targetCell);

            // Saved checkbox cell
            const savedCell = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("saved-checkbox");
            checkbox.dataset.index = week - 1;
            checkbox.dataset.weekly = "true";
            checkbox.addEventListener("change", function () {
              updateActual(this, weeklyTarget, "weekly");
              updateSummary("weekly");
              saveData();
            });
            savedCell.appendChild(checkbox);
            row.appendChild(savedCell);

            // Actual cell
            const actualCell = document.createElement("td");
            actualCell.textContent = "$0.00";
            actualCell.id = `actual-${week - 1}`;
            actualCell.dataset.weekly = "true";
            row.appendChild(actualCell);

            // Cumulative cell
            const cumulativeCell = document.createElement("td");
            cumulativeCell.textContent = "$0.00";
            cumulativeCell.id = `cumulative-${week - 1}`;
            cumulativeCell.dataset.weekly = "true";
            row.appendChild(cumulativeCell);

            // Notes cell
            const notesCell = document.createElement("td");
            const notesInput = document.createElement("input");
            notesInput.type = "text";
            notesInput.classList.add("notes");
            notesInput.placeholder = "Add notes...";
            notesInput.dataset.index = week - 1;
            notesInput.dataset.weekly = "true";
            notesInput.addEventListener("input", saveData);
            notesCell.appendChild(notesInput);
            row.appendChild(notesCell);

            tableBody.appendChild(row);

            totalTarget += weeklyTarget;
          }
        } else if (isMonthly) {
          // Generate monthly plan
          for (let month = 1; month <= duration; month++) {
            const monthStartDate = new Date(startDate);
            monthStartDate.setMonth(startDate.getMonth() + (month - 1));

            const monthEndDate = new Date(monthStartDate);
            monthEndDate.setMonth(monthStartDate.getMonth() + 1);
            monthEndDate.setDate(0); // Last day of the month

            const monthStartStr = formatDate(monthStartDate);
            const monthEndStr = formatDate(monthEndDate);
            const monthlyTarget = dailyTarget;

            const row = document.createElement("tr");

            // Month cell
            const monthCell = document.createElement("td");
            monthCell.textContent = month;
            row.appendChild(monthCell);

            // Start Date cell
            const startDateCell = document.createElement("td");
            startDateCell.textContent = monthStartStr;
            row.appendChild(startDateCell);

            // End Date cell
            const endDateCell = document.createElement("td");
            endDateCell.textContent = monthEndStr;
            row.appendChild(endDateCell);

            // Target cell
            const targetCell = document.createElement("td");
            targetCell.textContent = `$${monthlyTarget.toFixed(2)}`;
            row.appendChild(targetCell);

            // Saved checkbox cell
            const savedCell = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("saved-checkbox");
            checkbox.dataset.index = month - 1;
            checkbox.dataset.monthly = "true";
            checkbox.addEventListener("change", function () {
              updateActual(this, monthlyTarget, "monthly");
              updateSummary("monthly");
              saveData();
            });
            savedCell.appendChild(checkbox);
            row.appendChild(savedCell);

            // Actual cell
            const actualCell = document.createElement("td");
            actualCell.textContent = "$0.00";
            actualCell.id = `actual-${month - 1}`;
            actualCell.dataset.monthly = "true";
            row.appendChild(actualCell);

            // Cumulative cell
            const cumulativeCell = document.createElement("td");
            cumulativeCell.textContent = "$0.00";
            cumulativeCell.id = `cumulative-${month - 1}`;
            cumulativeCell.dataset.monthly = "true";
            row.appendChild(cumulativeCell);

            // Notes cell
            const notesCell = document.createElement("td");
            const notesInput = document.createElement("input");
            notesInput.type = "text";
            notesInput.classList.add("notes");
            notesInput.placeholder = "Add notes...";
            notesInput.dataset.index = month - 1;
            notesInput.dataset.monthly = "true";
            notesInput.addEventListener("input", saveData);
            notesCell.appendChild(notesInput);
            row.appendChild(notesCell);

            tableBody.appendChild(row);

            totalTarget += monthlyTarget;
          }
        } else {
          // Generate daily plan - use duration as number of days
          const totalDays = duration; // Now duration is in days
          for (let i = 0; i < totalDays; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            const dateStr = formatDate(currentDate);
            const dayStr = formatDay(currentDate.getDay());

            const row = document.createElement("tr");

            // Date cell
            const dateCell = document.createElement("td");
            dateCell.textContent = dateStr;
            row.appendChild(dateCell);

            // Day cell
            const dayCell = document.createElement("td");
            dayCell.textContent = dayStr;
            row.appendChild(dayCell);

            // Target cell
            const targetCell = document.createElement("td");
            targetCell.textContent = `$${dailyTarget.toFixed(2)}`;
            row.appendChild(targetCell);

            // Saved checkbox cell
            const savedCell = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("saved-checkbox");
            checkbox.dataset.index = i;
            checkbox.addEventListener("change", function () {
              updateActual(this, dailyTarget, "daily");
              updateSummary("daily");
              saveData();
            });
            savedCell.appendChild(checkbox);
            row.appendChild(savedCell);

            // Actual cell
            const actualCell = document.createElement("td");
            actualCell.textContent = "$0.00";
            actualCell.id = `actual-${i}`;
            row.appendChild(actualCell);

            // Cumulative cell
            const cumulativeCell = document.createElement("td");
            cumulativeCell.textContent = "$0.00";
            cumulativeCell.id = `cumulative-${i}`;
            row.appendChild(cumulativeCell);

            // Notes cell
            const notesCell = document.createElement("td");
            const notesInput = document.createElement("input");
            notesInput.type = "text";
            notesInput.classList.add("notes");
            notesInput.placeholder = "Add notes...";
            notesInput.dataset.index = i;
            notesInput.addEventListener("input", saveData);
            notesCell.appendChild(notesInput);
            row.appendChild(notesCell);

            tableBody.appendChild(row);

            totalTarget += dailyTarget;
          }
        }

        // Update summary
        document.getElementById(
          "total-target"
        ).textContent = `$${totalTarget.toFixed(2)}`;
        updateSummary(isWeekly ? "weekly" : isMonthly ? "monthly" : "daily");

        // Save data after generating plan
        saveData();
      }

      function formatDate(date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
      }

      function formatDay(dayIndex) {
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        return days[dayIndex];
      }

      function updateActual(checkbox, targetAmount, frequency) {
        const row = checkbox.parentNode.parentNode;
        let actualCell, cumulativeCell;

        if (frequency === "weekly") {
          actualCell = row.querySelector("td:nth-child(6)");
          cumulativeCell = row.querySelector("td:nth-child(7)");
        } else if (frequency === "monthly") {
          actualCell = row.querySelector("td:nth-child(6)");
          cumulativeCell = row.querySelector("td:nth-child(7)");
        } else {
          actualCell = row.querySelector("td:nth-child(5)");
          cumulativeCell = row.querySelector("td:nth-child(6)");
        }

        if (checkbox.checked) {
          actualCell.textContent = `$${targetAmount.toFixed(2)}`;

          // Calculate cumulative
          let prevCumulative = 0;
          const prevRow = row.previousElementSibling;
          if (prevRow) {
            const prevCumulativeText =
              frequency === "weekly"
                ? prevRow.querySelector("td:nth-child(7)").textContent
                : frequency === "monthly"
                ? prevRow.querySelector("td:nth-child(7)").textContent
                : prevRow.querySelector("td:nth-child(6)").textContent;
            prevCumulative =
              parseFloat(prevCumulativeText.replace("$", "")) || 0;
          }

          const newCumulative = prevCumulative + targetAmount;
          cumulativeCell.textContent = `$${newCumulative.toFixed(2)}`;

          // Update subsequent cumulative values
          updateSubsequentCumulative(row, newCumulative, frequency);
        } else {
          actualCell.textContent = "$0.00";

          // Reset cumulative for this row and subsequent rows
          const prevRow = row.previousElementSibling;
          let prevCumulative = 0;

          if (prevRow) {
            const prevCumulativeText =
              frequency === "weekly"
                ? prevRow.querySelector("td:nth-child(7)").textContent
                : frequency === "monthly"
                ? prevRow.querySelector("td:nth-child(7)").textContent
                : prevRow.querySelector("td:nth-child(6)").textContent;
            prevCumulative =
              parseFloat(prevCumulativeText.replace("$", "")) || 0;
          }

          cumulativeCell.textContent = `$${prevCumulative.toFixed(2)}`;
          updateSubsequentCumulative(row, prevCumulative, frequency);
        }
      }

      function updateSubsequentCumulative(startRow, baseCumulative, frequency) {
        let currentCumulative = baseCumulative;
        let nextRow = startRow.nextElementSibling;

        while (nextRow) {
          let actualText;

          if (frequency === "weekly") {
            actualText = nextRow.querySelector("td:nth-child(6)").textContent;
          } else if (frequency === "monthly") {
            actualText = nextRow.querySelector("td:nth-child(6)").textContent;
          } else {
            actualText = nextRow.querySelector("td:nth-child(5)").textContent;
          }

          const actual = parseFloat(actualText.replace("$", "")) || 0;

          currentCumulative += actual;

          let cumulativeCell;
          if (frequency === "weekly") {
            cumulativeCell = nextRow.querySelector("td:nth-child(7)");
          } else if (frequency === "monthly") {
            cumulativeCell = nextRow.querySelector("td:nth-child(7)");
          } else {
            cumulativeCell = nextRow.querySelector("td:nth-child(6)");
          }

          cumulativeCell.textContent = `$${currentCumulative.toFixed(2)}`;

          nextRow = nextRow.nextElementSibling;
        }
      }

      function updateSummary(frequency) {
        const rows = document.querySelectorAll("#savings-table tr");
        let totalTarget = 0;
        let totalSaved = 0;

        rows.forEach((row) => {
          let targetText, actualText;

          if (frequency === "weekly") {
            targetText = row.querySelector("td:nth-child(4)").textContent;
            actualText = row.querySelector("td:nth-child(6)").textContent;
          } else if (frequency === "monthly") {
            targetText = row.querySelector("td:nth-child(4)").textContent;
            actualText = row.querySelector("td:nth-child(6)").textContent;
          } else {
            targetText = row.querySelector("td:nth-child(3)").textContent;
            actualText = row.querySelector("td:nth-child(5)").textContent;
          }

          totalTarget += parseFloat(targetText.replace("$", "")) || 0;
          totalSaved += parseFloat(actualText.replace("$", "")) || 0;
        });

        document.getElementById(
          "total-target"
        ).textContent = `$${totalTarget.toFixed(2)}`;
        document.getElementById(
          "total-saved"
        ).textContent = `$${totalSaved.toFixed(2)}`;

        const progressPercent =
          totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
        document.getElementById(
          "progress-percent"
        ).textContent = `${progressPercent.toFixed(1)}%`;
      }

      // Save data to localStorage
      function saveData() {
        const isWeekly = frequencyWeekly.checked;
        const isMonthly = frequencyMonthly.checked;
        const data = {
          frequency: isWeekly ? "weekly" : isMonthly ? "monthly" : "daily",
          dailyTarget:
            parseFloat(document.getElementById("daily-target").value) || 0,
          startDate: document.getElementById("start-date").value,
          duration:
            parseInt(document.getElementById("duration").value) ||
            (isWeekly ? 12 : isMonthly ? 6 : 30),
          checkboxes: [],
          notes: [],
        };

        // Save checkbox states
        const checkboxes = document.querySelectorAll(".saved-checkbox");
        checkboxes.forEach((checkbox) => {
          data.checkboxes.push(checkbox.checked);
        });

        // Save notes
        const notesInputs = document.querySelectorAll(".notes");
        notesInputs.forEach((input) => {
          data.notes.push(input.value);
        });

        localStorage.setItem("savingsData", JSON.stringify(data));
      }

      // Load saved data
      function loadSavedData(data) {
        // Set checkboxes
        const checkboxes = document.querySelectorAll(".saved-checkbox");
        checkboxes.forEach((checkbox, index) => {
          if (data.checkboxes && data.checkboxes[index]) {
            checkbox.checked = data.checkboxes[index];
            // Trigger change to update actual and cumulative values
            const isWeekly = data.frequency === "weekly";
            const isMonthly = data.frequency === "monthly";
            const targetAmount =
              parseFloat(document.getElementById("daily-target").value) || 0;

            const event = new Event("change");
            // Store the parameters we need to pass to updateActual
            checkbox.dispatchEvent(event);

            // We need to manually call updateActual since we can't pass parameters with dispatchEvent
            const row = checkbox.parentNode.parentNode;
            let actualCell, cumulativeCell;

            if (isWeekly) {
              actualCell = row.querySelector("td:nth-child(6)");
              cumulativeCell = row.querySelector("td:nth-child(7)");
            } else if (isMonthly) {
              actualCell = row.querySelector("td:nth-child(6)");
              cumulativeCell = row.querySelector("td:nth-child(7)");
            } else {
              actualCell = row.querySelector("td:nth-child(5)");
              cumulativeCell = row.querySelector("td:nth-child(6)");
            }

            if (checkbox.checked) {
              actualCell.textContent = `$${targetAmount.toFixed(2)}`;

              // Calculate cumulative
              let prevCumulative = 0;
              const prevRow = row.previousElementSibling;
              if (prevRow) {
                const prevCumulativeText = isWeekly
                  ? prevRow.querySelector("td:nth-child(7)").textContent
                  : isMonthly
                  ? prevRow.querySelector("td:nth-child(7)").textContent
                  : prevRow.querySelector("td:nth-child(6)").textContent;
                prevCumulative =
                  parseFloat(prevCumulativeText.replace("$", "")) || 0;
              }

              const newCumulative = prevCumulative + targetAmount;
              cumulativeCell.textContent = `$${newCumulative.toFixed(2)}`;
            } else {
              actualCell.textContent = "$0.00";

              // Reset cumulative for this row and subsequent rows
              const prevRow = row.previousElementSibling;
              let prevCumulative = 0;

              if (prevRow) {
                const prevCumulativeText = isWeekly
                  ? prevRow.querySelector("td:nth-child(7)").textContent
                  : isMonthly
                  ? prevRow.querySelector("td:nth-child(7)").textContent
                  : prevRow.querySelector("td:nth-child(6)").textContent;
                prevCumulative =
                  parseFloat(prevCumulativeText.replace("$", "")) || 0;
              }

              cumulativeCell.textContent = `$${prevCumulative.toFixed(2)}`;
            }
          }
        });

        // Set notes
        const notesInputs = document.querySelectorAll(".notes");
        notesInputs.forEach((input, index) => {
          if (data.notes && data.notes[index]) {
            input.value = data.notes[index];
          }
        });

        updateSummary(data.frequency);
      }
    }
  });
