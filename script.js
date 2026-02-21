document.getElementById("dob").max =
  new Date().toISOString().split("T")[0];

let lastGeneratedID = "";
let lastGeneratedPassport = "";
let lastGeneratedName = "";

function pad(n, s) {
  return n.toString().padStart(s, "0");
}

function luhnChecksum(id) {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    let d = parseInt(id[i]);
    if ((i + 1) % 2 === 0) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return (10 - (sum % 10)) % 10;
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

function animateResult(id, text) {
  const box = document.getElementById(id);
  const span = box.querySelector(".result-text");
  span.innerText = text;

  box.classList.remove("show");
  setTimeout(() => box.classList.add("show"), 50);
}

function generateName() {
  const gender = document.getElementById("gender").value;

  const male = ["Thabo","Sipho","Neo","Liam","Daniel","Kagiso","Mandla"];
  const female = ["Lerato","Naledi","Emma","Sophia","Ava","Zanele","Nandi"];
  const surnames = ["Nkosi","Mokoena","Smith","Dlamini","Zulu","Naidoo","Mthembu"];

  const first = (gender === "male" ? male : female)
    [Math.floor(Math.random() * (gender === "male" ? male.length : female.length))];

  const last = surnames[Math.floor(Math.random() * surnames.length)];

  lastGeneratedName = first + " " + last;
  animateResult("nameResult", "Name: " + lastGeneratedName);
}

function generateID() {
  const dob = document.getElementById("dob").value;
  if (!dob) return showToast("Enter DOB first");

  const date = new Date(dob);

  const dobStr =
    pad(date.getFullYear() % 100, 2) +
    pad(date.getMonth() + 1, 2) +
    pad(date.getDate(), 2);

  const gender = document.getElementById("gender").value;

  const genderSeq = gender === "male"
    ? pad(Math.floor(Math.random() * 5000) + 5000, 4)
    : pad(Math.floor(Math.random() * 5000), 4);

  const partial = dobStr + genderSeq + "08";
  const checksum = luhnChecksum(partial);

  lastGeneratedID = partial + checksum;
  animateResult("idResult", "SA ID: " + lastGeneratedID);
}

function generatePassport() {
  const prefix = Math.random() < 0.5 ? "A" : "B";
  const number = pad(Math.floor(Math.random() * 100000000), 8);

  lastGeneratedPassport = prefix + number;
  animateResult("passportResult", "Passport: " + lastGeneratedPassport);
}

function exportToFile() {
  if (!lastGeneratedName)
    return showToast("Generate a name first");

  if (!lastGeneratedID && !lastGeneratedPassport)
    return showToast("Generate ID or Passport");

  let content = "Generated Identity\n";
  content += "-------------------\n\n";
  content += "Full Name: " + lastGeneratedName + "\n";

  if (lastGeneratedID)
    content += "SA ID Number: " + lastGeneratedID + "\n";

  if (lastGeneratedPassport)
    content += "Passport Number: " + lastGeneratedPassport + "\n";

  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = lastGeneratedName.replace(" ", "_") + "_" + lastGeneratedID.replace(" ", "_") + "_" + lastGeneratedPassport.replace(" ", "_") + ".txt";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Saved successfully");
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function copyFromBox(id) {
  const box = document.getElementById(id);
  const fullText = box.querySelector(".result-text").innerText;

  if (!fullText) return;

  // Split at colon and trim spaces
  const valueOnly = fullText.includes(":")
    ? fullText.split(":")[1].trim()
    : fullText;

  navigator.clipboard.writeText(valueOnly);
  showToast("Copied to clipboard");
}