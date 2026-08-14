const d = new Date();
const year = d.getFullYear();
const month = d.getMonth();
const daysInMonth = new Date(year, month + 1, 0).getDate();
const firstDay = new Date(year, month, 1).getDay();
console.log({ year, month, daysInMonth, firstDay });
