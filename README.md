# Movie Night Generator

Movie Night Generator is a user-friendly web app that helps users discover and save movies by genre. Instead of endlessly scrolling through streaming services, this app lets you pick a genre, view recommended movies, save them to a watchlist, and visualize your preferences with a genre-based chart.

## Target Browsers

This app works smoothly on all modern browsers:

- Chrome (desktop and mobile)
- Firefox
- Safari (iOS and macOS)
- Microsoft Edge

## Live Site

Check it out here:  
https://finalproject-eight-chi.vercel.app/

---

## Developer Manual

This section is for future developers who want to continue working on the project. It explains how to set up, run, and understand the system.

---

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/hadimohammed17/finalproject.git
cd finalproject
```

#### 2. Supabase Table Setup

Create a Supabase table named `likedMovies` with the following columns:

| Column   | Type   | Description                   |
|----------|--------|-------------------------------|
| id       | bigint | Auto-generated primary key    |
| title    | text   | Movie title                   |
| overview | text   | Movie description             |
| genres   | text   | Comma-separated genre names   |

Make sure the `id` column is set to **Generated Always as Identity** in Supabase.

---

### Running the App

#### Run Locally

Open `index.html` in your browser.

#### Deploy Online

I used vercel to deploy it.

All functionality runs client-side with Supabase.

---

### Project Structure

| File             | Description                                   |
|------------------|-----------------------------------------------|
| `index.html`     | Homepage and introduction                     |
| `movies.html`    | Genre picker and movie display                |
| `saved.html`     | Watchlist with genre pie chart                |
| `script.js`      | Handles logic, fetch calls, and interactivity |
| `finalstyle.css` | Styles and layout                             |

---

### Backend API Endpoints

This app uses Supabase directly (no custom Express server). The following Supabase functions are used:

- `insert()` – Saves a movie to the database  
- `select()` – Loads saved movies from the table  
- `delete()` – Removes a movie by ID

All of these are called from the front-end JavaScript.

---

### Testing

#### Frontend Testing Ideas
- Check that movie recommendations display correctly after selecting a genre.
- Confirm that clicking "Save" adds the movie to the Supabase database.
- Ensure the pie chart updates after adding or removing a movie.

#### Backend Testing Ideas 
- Test that `insert()` correctly adds a movie entry.
- Test that `select()` retrieves all expected saved movies.
- Test that `delete()` removes the correct movie from the database.


---

### Known Bugs & Roadmap

#### Known Issues

- All users share the same Supabase table (no individual login)
- The anonymous Supabase key is public (safe with public role, but not for private data)
- Some genres might be missing or misnamed due to TMDB API limitations

#### Future Enhancements

- Add Supabase Auth so users have private watchlists
- Let users filter movies by year or rating
- Add trailers or poster previews

---

### Credits

- Movie data provided by [TMDB API](https://www.themoviedb.org/documentation/api)
- Backend handled by [Supabase](https://supabase.com/)
- Genre chart generated using [Chart.js](https://www.chartjs.org/)
