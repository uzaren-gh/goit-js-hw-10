// const fieldS = 'name,capital,population,languages,flags';

export function fetchCountries(name, fields) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fullText=false?fields=${fields}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
