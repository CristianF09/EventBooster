import { fetchEvents } from './discoveryapi';
import { generatePagination } from './pagination';
import Notiflix from 'notiflix';
import pin from '../images/vector.svg';

const itemGallery = document.querySelector('.item-gallery');
const dropdownList = document.querySelector('.dropdown-list');
const pagesList = document.querySelector('.pages');
const modal = document.getElementById('modal');
const closeModal = document.querySelector('.close');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalDescription = document.getElementById('modal-description');

const populateCountriesDropdown = () => {
  const markup = countries
    .map(country => `<option value="${country.code}">${country.name}</option>`)
    .join('');
  dropdownList.innerHTML = markup;
};

const populateEventGallery = events => {
  const markup = events
    .map(event => `<div class="item-card" data-title="${event.name}" data-image="${event.images[0].url}" data-description="${event.dates.start.localDate}">
        <a href="${event.images[0].url}" target="_blank">
          <div class="image-wrapper">
            <img src="${event.images[0].url}" alt="${event.name}" loading="lazy" width="267"/>
          </div>
        </a>
        <div class="item-info">
          <p class="item-title">${event.name}</p>
          <p class="item-date">${event.dates.start.localDate}</p>
          <p class="item-location">
            <span><img src="${pin}" />${event._embedded.venues[0].name}</span>
          </p>
        </div>
      </div>`)
    .join('');
  itemGallery.innerHTML = markup;

  // Add click event listeners to cards
  document.querySelectorAll('.item-card').forEach(card => {
    card.addEventListener('click', () => {
      modalTitle.textContent = card.dataset.title;
      modalImage.src = card.dataset.image;
      modalDescription.textContent = card.dataset.description;
      modal.style.display = 'block';
    });
  });
};

const processEventData = async () => {
  const query = localStorage.getItem("query") || "";
  const country = localStorage.getItem("country") || "";
  const page = localStorage.getItem("page") || 1;

  const eventsObject = await fetchEvents(query, country, page);
  
  if (eventsObject && eventsObject.data && eventsObject.data._embedded && eventsObject.data._embedded.events.length > 0) {
    populateEventGallery(eventsObject.data._embedded.events);
    generatePagination(page, eventsObject.totalCount);
  } else {
    itemGallery.innerHTML = '';
    Notiflix.Notify.failure('Sorry, there are no results.');
  }
};

const onCountryChange = async () => {
  const selectedCountry = dropdownList.value;
  localStorage.setItem("country", selectedCountry);
  localStorage.setItem("page", 1);
  await processEventData();
};

const onPageChange = (e) => {
  e.preventDefault();
  const selectedValue = e.target.dataset.page;
  localStorage.setItem("page", selectedValue);
  processEventData();
};

document.getElementById('search-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = e.target.elements.searchQuery.value.trim();
  localStorage.setItem("query", query);
  localStorage.setItem("page", 1);
  await processEventData();
});

dropdownList.addEventListener('change', onCountryChange);
pagesList.addEventListener('click', onPageChange);

// Close modal on close button click
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close modal when clicking outside of the modal content
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// Initial data load
processEventData();