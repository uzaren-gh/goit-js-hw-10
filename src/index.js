import './css/styles.css';
import Notiflix, { Notify } from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

Notiflix.Notify.init({
  position: 'center-top',
  width: '480px',
  fontSize: '25px',
  fontFamily: 'Roboto',
  clickToClose: true,
  timeout: 1500,
});

const DEBOUNCE_DELAY = 300;
let debounce = require('lodash.debounce');
const fields = 'name,capital,population,languages,flags';
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');
const searchBox = document.querySelector('#search-box');

searchBox.addEventListener(
  'input',
  debounce(wayChoise, DEBOUNCE_DELAY, {
    leading: true,
    trailing: false,
  })
);

function wayChoise() {
  if (searchBox.value === '') {
    clearResult();
  } else {
    fetchCountries(searchBox.value, fields)
      .then(country => {
        renderCountry(country);
      })
      .catch(error => {
        clearResult();
        searchBox.style.outlineColor = '#dc3545';
        Notify.failure('Oops, there is no country with that name');
        // console.log(error);
      });
  }
}

function renderCountry(country) {
  let markup = '';
  const amount = country.length;

  if (amount > 10) {
    clearResult();
    searchBox.style.outlineColor = '#1e4dd9';
    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  if (amount >= 2 && amount <= 10) {
    clearResult();
    searchBox.style.outlineColor = '#1ae7eb';
    for (let i = 0; i < amount; i += 1) {
      const { name, flags } = country[i];
      markup =
        markup +
        `<li> <span> <img class=flag-img src="${flags.svg}" width = "25" height = "15"></span> ${name.common} </li>`;
    }
    countryList.innerHTML = markup;
  } else {
    //   .map(country => {
    clearResult();
    searchBox.style.outlineColor = '#199c0b';
    const { capital, population, name, flags, languages } = country[0];
    const language = Object.values(languages);
    markup = `
      <h1> <span> <img class=flag-img src="${flags.svg}" width = "60" height = "40"></span> ${name.common} </h1>
      <h3> Official Name: "${name.official}" </h3>
          <li><b>Capital</b>: ${capital}</li>
          <li><b>Population</b>: ${population}</li>
          <li><b>Languages</b>: ${language}</li>
          `;

    countryInfo.innerHTML = markup;
  }
}

function clearResult() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  searchBox.style.outlineColor = '#6d6f73';
}
