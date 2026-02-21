import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class Identity {
  // Data Arrays
  private surnames = ["Nkosi", "Mokoena", "Smith", "Dlamini", "Zulu", "Naidoo", "Mthembu", "Mabena", "Mahlangu", "Mkhize"];
  private maleNames = ["Thabo", "Sipho", "Neo", "Liam", "Daniel", "Kagiso", "Mandla", "Andile", "Siyabonga"];
  private femaleNames = ["Lerato", "Naledi", "Emma", "Sophia", "Ava", "Zanele", "Nandi", "Thandeka", "Busisiwe"];

  constructor() { }

  /**
   * Generates a random name based on gender
   */
  generateName(gender: string): string {
    const list = gender === 'male' ? this.maleNames : this.femaleNames;
    const first = list[Math.floor(Math.random() * list.length)];
    const last = this.surnames[Math.floor(Math.random() * this.surnames.length)];
    return `${first} ${last}`;
  }

  /**
   * Generates a valid South African ID structure
   */
  generateSAID(dob: string, gender: string): string {
    const date = new Date(dob);
    
    // YYMMDD
    const year = (date.getFullYear() % 100).toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // SSSS (Gender): 0000-4999 for Female, 5000-9999 for Male
    const genderSeq = gender === 'male' 
      ? (Math.floor(Math.random() * 5000) + 5000).toString().padStart(4, '0')
      : Math.floor(Math.random() * 5000).toString().padStart(4, '0');

    // C (Citizenship): 0 for SA Citizen, 1 for Permanent Resident
    // A (Race/Random): Usually 8 or 9
    const partial = `${year}${month}${day}${genderSeq}08`;
    
    // Z (Checksum)
    const checksum = this.calculateLuhn(partial);
    return partial + checksum;
  }

  /**
   * Luhn Algorithm for the final check digit
   */
  private calculateLuhn(id: string): number {
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
}
