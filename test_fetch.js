fetch('http://localhost:3000/api/settings').then(res => res.json()).then(data => {
  let specificDates = data.specificDates;
  if (typeof specificDates === 'string') specificDates = JSON.parse(specificDates);
  if (typeof specificDates === 'string') specificDates = JSON.parse(specificDates);
  console.log(Object.keys(specificDates));
});
