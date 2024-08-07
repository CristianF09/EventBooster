import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = 'JFfDy34LrJl7VVgBTc7jqnnTRHXCQbbZ';
const URL = 'https://app.ticketmaster.com/discovery/v2/events';

const HITSPERPAGE = 16;

const fetchEvents = async (query = "", country = undefined, page = 1) => {
  try {
    const response = await axios.get(`${URL}`, {
      params: {
        apikey: API_KEY,
        keyword: query,
        page,
        size: `${HITSPERPAGE}`,
        countryCode: country,
      },
    });
    return { data: response.data, totalCount: response.data.page.totalElements };
  } catch (error) {
    console.error('Error fetching events:', error);
    Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
    return { data: null, totalCount: 0 };
  }
};

export { fetchEvents, HITSPERPAGE };