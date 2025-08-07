    document.getElementById("dob").max = new Date().toISOString().split("T")[0];

    let lastGeneratedID = "";
    let lastGeneratedPassport = "";

    function pad(num, size) {
      let s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
    }

    function luhnChecksum(id) {
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        let digit = parseInt(id.charAt(i));
        if ((i + 1) % 2 === 0) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
      }
      return (10 - (sum % 10)) % 10;
    }

    function generateID() {
      const dobInput = document.getElementById("dob").value;
      const gender = document.getElementById("gender").value;

      if (!dobInput) {
        alert("Please enter a valid date of birth.");
        return;
      }

      const date = new Date(dobInput);
      const today = new Date();
      if (date > today || date.getFullYear() < 1900) {
        alert("DOB must be between 1900 and today.");
        return;
      }

      const year = pad(date.getFullYear() % 100, 2);
      const month = pad(date.getMonth() + 1, 2);
      const day = pad(date.getDate(), 2);
      const dob = year + month + day;

      let genderSeq;
      if (gender === "male") {
        genderSeq = pad(Math.floor(Math.random() * 5000) + 5000, 4);
      } else {
        genderSeq = pad(Math.floor(Math.random() * 5000), 4);
      }

      let citizenship = Math.random() < 0.9 ? "0" : "1";
      let race = "8";
      let partialID = dob + genderSeq + citizenship + race;
      let checksum = luhnChecksum(partialID);
      let fullID = partialID + checksum;

      lastGeneratedID = fullID;
      document.getElementById("idResult").innerText = "Generated ID: " + fullID;
    }

    function generatePassport() {
      let prefix = Math.random() < 0.5 ? "A" : "B";
      let number = Math.floor(Math.random() * 1_0000_0000);
      let passport = prefix + pad(number, 8);

      lastGeneratedPassport = passport;
      document.getElementById("passportResult").innerText = "Generated Passport: " + passport;
    }

    function exportToFile() {
      let content = "";
      if (lastGeneratedID) content += "SA ID Number: " + lastGeneratedID + "\n";
      if (lastGeneratedPassport) content += "Passport Number: " + lastGeneratedPassport + "\n";

      if (!content) {
        alert("Please generate an ID or Passport first.");
        return;
      }

      const blob = new Blob([content], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "generated_documents.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    function copyToClipboard() {
      let content = "";
      if (lastGeneratedID) content += "SA ID Number: " + lastGeneratedID + "\n";
      if (lastGeneratedPassport) content += "Passport Number: " + lastGeneratedPassport + "\n";

      if (!content) {
        alert("Please generate an ID or Passport first.");
        return;
      }

      navigator.clipboard.writeText(content).then(() => {
        alert("Copied to clipboard!");
      }).catch(err => {
        alert("Failed to copy: " + err);
      });
    }