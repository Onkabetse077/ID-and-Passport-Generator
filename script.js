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
      let checksum = (10 - (sum % 10)) % 10;
      return checksum;
    }

    function generateID() {
      const dobInput = document.getElementById("dob").value;
      let dob;

      if (dobInput) {
        const date = new Date(dobInput);
        const year = pad(date.getFullYear() % 100, 2);
        const month = pad(date.getMonth() + 1, 2);
        const day = pad(date.getDate(), 2);
        dob = year + month + day;
      } else {
        // Fallback: random DOB if none provided
        let year = pad(Math.floor(Math.random() * 60) + 50, 2);
        let month = pad(Math.floor(Math.random() * 12) + 1, 2);
        let day = pad(Math.floor(Math.random() * 28) + 1, 2);
        dob = year + month + day;
      }

      let genderSeq = pad(Math.floor(Math.random() * 10000), 4);
      let citizenship = Math.random() < 0.9 ? "0" : "1";
      let race = "8";
      let partialID = dob + genderSeq + citizenship + race;
      let checksum = luhnChecksum(partialID);
      let fullID = partialID + checksum;

      document.getElementById("idResult").innerText = "Generated ID: " + fullID;
    }

    function generatePassport() {
      let prefix = Math.random() < 0.5 ? "A" : "B";
      let number = Math.floor(Math.random() * 1_0000_0000);
      let passport = prefix + pad(number, 8);

      document.getElementById("passportResult").innerText = "Generated Passport: " + passport;
    }