function showThis() {
  console.log(this);
}

const obj = { name: "Joe", show: showThis };
console.log(obj);
showThis(); // en strict mode -> undefined (sinon global)
console.log(obj.show()); // this === obj
console.log(showThis.call(obj)); // this === obj (call/apply)

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  say() {
    console.log("Hi, I'm", this.name);
  }
  print() {
    console.log(`${this.say()} and i have ${this.name}`);
  }
  static hello() {
    console.log("static method");
  }
}
const p = new Person("Ali");
p.say(); // méthode d'instance
console.log(Person.hello()); // méthode statique

const moi = new Person("joseph", "23");
console.log(moi.print(), moi.say());
/*class Timer {
  constructor() {
    this.count = 0;
    // méthode liée automatiquement
    this.tick = () => {
      this.count++;
      console.log(this.count);
    };
  }
}
const t = new Timer();
setInterval(t.tick, 1000); // fonctionne, this === instance
*/
