const movies = [
    { id: 1, title: "Inception", genre: "Sci-Fi", year: 2010 },
    { id: 2, title: "The Dark Knight", genre: "Action", year: 2008 },
    { id: 3, title: "Interstellar", genre: "Sci-Fi", year: 2014 },
    { id: 4, title: "Parasite", genre: "Thriller", year: 2019 },
    { id: 5, title: "Avengers: Endgame", genre: "Action", year: 2019 },
  ];
  
  const userRatings = {
    user1: { 1: 5, 2: 4, 3: 5 },
    user2: { 2: 5, 4: 5 },
    user3: { 1: 4, 3: 4, 5: 5 },
  };
  
  function calculateSimilarity(userA, userB) {
    const ratingsA = userRatings[userA];
    const ratingsB = userRatings[userB];
  
    let sumA = 0;
    let sumB = 0;
    let sumASq = 0;
    let sumBSq = 0;
    let sumProduct = 0;
    let count = 0;
  
    for (const movieId in ratingsA) {
      if (movieId in ratingsB) {
        const ratingA = ratingsA[movieId];
        const ratingB = ratingsB[movieId];
  
        sumA += ratingA;
        sumB += ratingB;
        sumASq += ratingA * ratingA;
        sumBSq += ratingB * ratingB;
        sumProduct += ratingA * ratingB;
        count++;
      }
    }
  
    if (count === 0) return 0;
  
    const numerator = sumProduct - (sumA * sumB) / count;
    const denominator = Math.sqrt(
      (sumASq - (sumA * sumA) / count) * (sumBSq - (sumB * sumB) / count)
    );
  
    return denominator ? numerator / denominator : 0;
  }
  
  function recommendMovies(currentUser, topN) {
    const similarities = {};
  
    for (const user in userRatings) {
      if (user !== currentUser) {
        similarities[user] = calculateSimilarity(currentUser, user);
      }
    }
  
    const similarUsers = Object.entries(similarities).sort((a, b) => b[1] - a[1]);
  
    const recommendations = {};
  
    for (const [user, similarity] of similarUsers) {
      for (const movieId in userRatings[user]) {
        if (!userRatings[currentUser][movieId]) {
          recommendations[movieId] =
            (recommendations[movieId] || 0) + userRatings[user][movieId] * similarity;
        }
      }
    }
  
    const sortedRecommendations = Object.entries(recommendations)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN);
  
    if (sortedRecommendations.length < topN) {
      const seenMovies = new Set(Object.keys(userRatings[currentUser]));
      const additionalMovies = movies.filter(
        (movie) => !seenMovies.has(movie.id.toString())
      );
  
      additionalMovies.forEach((movie) => {
        if (!recommendations[movie.id]) {
          sortedRecommendations.push([movie.id.toString(), 0]);
        }
      });
  
      sortedRecommendations.splice(topN);
    }
  
    return sortedRecommendations.map(([movieId]) =>
      movies.find((movie) => movie.id === parseInt(movieId))
    );
  }
  
  function displayRecommendations(user, topN) {
    const recommendations = recommendMovies(user, topN);
  
    console.log(`Top ${topN} recommendations for ${user}:`);
    recommendations.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} (${movie.genre}, ${movie.year})`);
    });
  }
  
  displayRecommendations("user1", 3);
  