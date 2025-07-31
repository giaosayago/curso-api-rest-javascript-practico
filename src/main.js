const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});

function createMoviesPreview(movies,PreviewList) {
    
    PreviewList.innerHTML = ''; 

    movies.forEach(movie => {   
        
        const movieContainer = document.createElement('div');

        movieContainer.classList.add('movie-container');

        movieContainer.addEventListener('click', () =>  {
            location.hash = `#movie=${movie.id}`;
        });    

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt',movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300/'+ movie.poster_path);
        
        movieContainer.appendChild(movieImg);
        PreviewList.appendChild(movieContainer);

    });
}

function createCategories  (categories, container) { 

    container.innerHTML = ''; // Clear previous content

    categories.forEach(category => {   
        
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');
        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id'+category.id);
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
    const {data} = await api('trending/movie/day');    
    const movies = data.results;

    createMoviesPreview(movies, trendingMoviesPreviewList);

}

async function getCategoriesPreview() { 
    const {data} = await api('genre/movie/list');  
    
    const categories = data.genres;
    console.log({data, categories});

    createCategories(categories, categoriesPreviewList);
    
}     

async function getMovieByCategory(id) {
    const {data} = await api('discover/movie', {
        params: {
            with_genres: id,
        },  
    });    
    const movies = data.results;

     createMoviesPreview(movies, genericSection);
      
}


async function getMoviesBySearch(searchData) {
    const {data} = await api('search/movie', {
        params: {
            query: searchData,
        },  
    });    
    const movies = data.results;

    console.log({data, movies});

     createMoviesPreview(movies, genericSection);
      
}


async function getTrendingMovies() {
    const {data} = await api('trending/movie/day');    
    const movies = data.results;

    createMoviesPreview(movies, genericSection);

}


async function getMovieById(movieId) {
    const {data: movie} = await api('movie/'+movieId);   
    console.log(movie);
    const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    console.log(movieImgUrl);
    headerSection.style.background = 'url('+movieImgUrl+')';
    
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;  

    createCategories(movie.genres, movieDetailCategoriesList);

}

