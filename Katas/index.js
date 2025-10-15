function solution(str) {
  console.log(str.split(""));
  let result = [];
  for (let i = 0; i < Array.length; i++) {}
  console.log(result);
  return result;
}
solution("abcdef");
console.log(solution("joseph"));

let array = ["a", "b", "c", "d", "e", "f"];
let result = [];
for (let i = 0; i < array.length; i++) {
  if (array.length % 3 === true) {
    result = [array[i]];
  }
}
console.log(result);
const array2 = (array = [...array, "a"]);
console.log(array2[4]);
if ()
