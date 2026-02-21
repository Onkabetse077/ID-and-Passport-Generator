import { Component } from '@angular/core';
import { Identity } from './identity';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [FormsModule]
})
export class AppComponent {
  dob: string = '';
  gender: string = 'male';
  maxDob: string = new Date().toISOString().split('T')[0];

  lastGeneratedName = '';
  lastGeneratedID = '';
  lastGeneratedPassport = '';

  toastMessage = '';

  // ---------------- Helpers ----------------
  pad(n: number, s: number) {
    return n.toString().padStart(s, '0');
  }

  luhnChecksum(id: string) {
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

  showToast(msg: string) {
    this.toastMessage = msg;
    setTimeout(() => this.toastMessage = '', 2500);
  }

  copyToClipboard(value: string) {
    navigator.clipboard.writeText(value);
    this.showToast('Copied to clipboard');
  }

  // ---------------- Generators ----------------
  generateName() {
    const male = ["Thabo","Sipho","Neo","Liam","Daniel","Kagiso","Mandla","Andile","Siyabonga","Teboho","Moses","Riaan","Kgosi","Jabulani","Sibusiso","Pule","Leroy","Lethabo","Cebo","Mandla","Jack","Thabiso"];
    const female = ["Lerato","Naledi","Emma","Sophia","Ava","Zanele","Nandi","Thandeka","Sibongile","Busisiwe","Karabo","Amara","Precious","Nosipho","Mpho","Buhle","Lindiwe","Dineo","Palesa","Nomsa"];
    const surnames = ["Nkosi","Mokoena","Smith","Dlamini","Zulu","Naidoo","Mthembu","Mabena","Mahlangu","Mkhize","Mthethwa","Ndaba","Radebe","Maseko","Mthembu","Mabuza","Buthelezi","Khumalo","Mpanza","Masango","Aphane","Kekana"];

    const first = this.gender === 'male'
      ? male[Math.floor(Math.random() * male.length)]
      : female[Math.floor(Math.random() * female.length)];
    const last = surnames[Math.floor(Math.random() * surnames.length)];

    this.lastGeneratedName = `${first} ${last}`;
  }

  generateID() {
    if (!this.dob) return this.showToast('Enter DOB first');

    const date = new Date(this.dob);
    const dobStr = this.pad(date.getFullYear() % 100, 2) +
                   this.pad(date.getMonth() + 1, 2) +
                   this.pad(date.getDate(), 2);

    const genderSeq = this.gender === 'male'
      ? this.pad(Math.floor(Math.random() * 5000) + 5000, 4)
      : this.pad(Math.floor(Math.random() * 5000), 4);

    const partial = dobStr + genderSeq + '08';
    const checksum = this.luhnChecksum(partial);

    this.lastGeneratedID = partial + checksum;
  }

  generatePassport() {
    const prefix = Math.random() < 0.5 ? 'A' : 'B';
    const number = this.pad(Math.floor(Math.random() * 100000000), 8);
    this.lastGeneratedPassport = prefix + number;
  }

  exportToFile() {
    if (!this.lastGeneratedName) return this.showToast('Generate a name first');
    if (!this.lastGeneratedID && !this.lastGeneratedPassport) return this.showToast('Generate ID or Passport');

    let content = `Generated Identity\n-------------------\n\nFull Name: ${this.lastGeneratedName}\n`;
    if (this.lastGeneratedID) content += `SA ID Number: ${this.lastGeneratedID}\n`;
    if (this.lastGeneratedPassport) content += `Passport Number: ${this.lastGeneratedPassport}\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${this.lastGeneratedName.replace(' ', '_')}_${this.lastGeneratedID}_${this.lastGeneratedPassport}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast('Saved successfully');
  }

  toggleTheme() {
    document.body.classList.toggle('dark');
  }
}