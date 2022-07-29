const Movies = require('../models/movies');
module.exports = {
  getById: async (req, res, next) => {
    console.log(req.body);
    try {
      const movieInfo = await Movies.findById(req.params.movieId);
      if (movieInfo) {
        res.status(200).send({ status: "success", message: "Movie found!!!", data: { movies: movieInfo } });
      } else {
        throw 'NO_MOVIE'
      }
    } catch (error) {
      res.status(403).send({ status: "failed", message: "Not found", data: null });
    }
  },
  getAll: async (req, res, next) => {
    let moviesList = [];
    try {
      const movies = await Movies.find({});
      if (movies) {
        for (let movie of movies) {
          moviesList.push({ id: movie._id, name: movie.name, released_on: movie.released_on });
        }
        res.status(200).send({ status: "success", message: "Movies list found!!!", data: { movies: moviesList } });
      } else {
        throw 'NO_MOVIE'
      }
    } catch (error) {
      res.status(403).send({ status: "failed", message: "Not found", data: null });
    }
  },
  updateById: async (req, res, next) => {
    try {
      const movieInfo = await Movies.findByIdAndUpdate(req.params.movieId, { name: req.body.name });
      if (movieInfo) {
        res.status(200).send({ status: "success", message: "Movie updated successfully!!!", data: null });
      } else {
        throw 'UPDATE_MOVIE_FAILED'
      }
    } catch (error) {
      res.status(403).send({ status: "failed", message: "Not found", data: null });
    }
  },
  deleteById: async (req, res, next) => {
    try {
      const movieInfo = await Movies.findByIdAndRemove(req.params.movieId);
      res.status(200).send({ status: "success", message: "Movie deleted successfully!!!", data: null });
    } catch (error) {
      res.status(403).send({ status: "failed", message: "Not found", data: null });
    }
  },
  create: async (req, res, next) => {
    try {
      const result = await Movies.create({ name: req.body.name, released_on: req.body.released_on });
      res.status(200).send({ status: "success", message: "Movie added successfully!!!", data: null });
    } catch (error) {
      res.status(403).send({ status: "failed", message: "Not found", data: null });
    }
  },
}
