const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});

const lazyLaoder = new IntersectionObserver((entiries) => {
    entiries.forEach(entry => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            console.log(url);
            entry.target.setAttribute('src', url);
        }
    });
});


function createMoviesPreview(movies, PreviewList, lazyLaod = false) {

    PreviewList.innerHTML = '';

    movies.forEach(movie => {

        const movieContainer = document.createElement('div');

        movieContainer.classList.add('movie-container');

        movieContainer.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`;
        });

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);


        movieImg.setAttribute(
            lazyLaod ? 'data-img' : 'src',
            'https://image.tmdb.org/t/p/w300/' + movie.poster_path
        );

        movieImg.addEventListener('error', () => {
            movieImg.setAttribute('src', 'https://images.unsplash.com/photo-1744137285276-57ca4048f805?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D');
        });

        if (lazyLaod) {
            lazyLaoder.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        PreviewList.appendChild(movieContainer);

    });
}

function createCategories(categories, container) {

    container.innerHTML = ''; // Clear previous content

    categories.forEach(category => {

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');
        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
        });
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    })
}

async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;

    createMoviesPreview(movies, trendingMoviesPreviewList, true);

}

async function getCategoriesPreview() {
    const { data } = await api('genre/movie/list');

    const categories = data.genres;
    console.log({ data, categories });

    createCategories(categories, categoriesPreviewList);

}

async function getMovieByCategory(id) {
    const { data } = await api('discover/movie', {
        params: {
            with_genres: id,
        },
    });
    const movies = data.results;

    createMoviesPreview(movies, genericSection,true);

}


async function getMoviesBySearch(searchData) {
    const { data } = await api('search/movie', {
        params: {
            query: searchData,
        },
    });
    const movies = data.results;

    console.log({ data, movies });

    createMoviesPreview(movies, genericSection, true);

}


async function getTrendingMovies() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;

    createMoviesPreview(movies, genericSection, true);

}


async function getMovieById(movieId) {
    const { data: movie } = await api('movie/' + movieId);
    console.log(movie);
    const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    console.log(movieImgUrl);
    headerSection.style.background = 'url(' + movieImgUrl + ')';

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList);

}

