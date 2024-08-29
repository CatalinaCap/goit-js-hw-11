import loadMoreBtn from './btn.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const ENDPOINT = 'https://pixabay.com/api/';
const API_KEY = '45698351-55ab21370f961a120252b2ff0';
const PER_PAGE = 20;
let currentPage = 1;
let currentQuery = '';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');

const loadMoreButton = new loadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

form.addEventListener('submit', onSearch);
loadMoreButton.button.addEventListener('click', onLoadMore);
window.addEventListener('scroll', onScroll);

async function onSearch(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  loadMoreButton.hide();
  currentPage = 1;
  currentQuery = event.currentTarget.elements.searchQuery.value.trim();

  if (currentQuery === '') {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }

  const data = await fetchImages(currentQuery);

  if (data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  displayImages(data.hits);
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

  if (data.totalHits > PER_PAGE) {
    loadMoreButton.show();
  }
}
show();
this.button.classList.remove('hidden');
setTimeout(() => this.button.classList.add('show'), 10);

async function onLoadMore() {
  currentPage += 1;
  loadMoreButton.disable();

  const data = await fetchImages(currentQuery);
  displayImages(data.hits);
  loadMoreButton.enable();

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });

  if (currentPage * PER_PAGE >= data.totalHits) {
    loadMoreButton.hide();
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
async function onScroll() {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    !loadMoreButton.button.disabled
  ) {
    onLoadMore();
  }
}

async function fetchImages(query) {
  const response = await fetch(
    `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${PER_PAGE}`
  );
  return await response.json();
}

function displayImages(images) {
  const markup = images
    .map(
      image => `
    <a href="${image.largeImageURL}" class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes</b> ${image.likes}</p>
        <p class="info-item"><b>Views</b> ${image.views}</p>
        <p class="info-item"><b>Comments</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads</b> ${image.downloads}</p>
      </div>
    </a>
  `
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);

  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
}
