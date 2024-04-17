# Curble

Welcome to Curble, the community-driven platform designed to promote recycling and reuse by enabling community members to easily give away and claim items left on the curb.

## Screenshots

Here are some screenshots from the Curble application:

### Home Page
![Home Demo](client/src/assets/Screenshot%202024-04-16%20at%204.54.08%20PM.png)

### Browse Demo
![Browse Interface](client/src/assets/Screenshot%202024-04-16%20at%204.54.31%20PM.png)

## Table of Contents

- [Project Overview](#project-overview)
- [Timeline](#timeline)
- [Domain Model](#domain-model)
- [User Stories](#user-stories)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Stretch Goals](#stretch-goals)
- [Setup Instructions](#setup-instructions)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

**Owner/s:**  
Kevin Castillo

**Project Name:**  
Curble

**Phase and Cohort:**  
Phase 5 - 010824 East

**Description:**  
Curble is a platform that connects community members, facilitating the free exchange of items that would otherwise be discarded. By offering a way to give away and claim items, Curble encourages environmental consciousness and community interaction.

## Timeline

- **04/03:** Project kickoff - Initial setup, including project structure and database modeling.
- **04/04:** Backend development start - Implementing Users and Items models.
- **04/05:** Continue backend - Adding Favorites and UserFeedback models, starting on API routes.
- **04/06:** Frontend setup - Begin React setup, focusing on the Home and About routes.
- **04/07:** Frontend development - Work on Register and Log In routes.
- **04/08:** Frontend development - Implement Account and Browse routes, integrating backend API.
- **04/09:** Testing and debugging of all implemented features.
- **04/10:** UI enhancements - Improving user interface based on feedback.
- **04/11:** Stretch goal assessment - Decide on stretch goals to implement based on progress.
- **04/12 to 04/14:** Implementation and finalization of stretch goals/additional features.
- **04/15:** Polish application - Final UI/UX adjustments.
- **04/16:** Documentation - Completing documentation, and preparing for presentation.
- **04/17:** Presentation preparation - Final review and rehearsal.
- **04/18:** Project presentation/Graduation - Present Curble to Cohort!

## Domain Model

            Favorites (user_id and item_id)
                      /       \
                     /         \
                User ----< Items 
                     \        /
                      \      /
        UserFeedback (user_id and item_id)

**Relationships:**
- Users to Items: One-to-Many
- Users to Favorites: Many-to-Many
- Users to UserFeedback: Many-to-Many
- Items to Favorites: One-to-Many
- Items to UserFeedback: One-to-Many

## User Stories

- Users can register and log into their accounts.
- Users can post items with details like description, location, and images.
- Users can browse items posted by others and mark items as favorites.
- Users can provide feedback on items, enhancing community trust and interaction.

### Technology Stack

- **Frontend:**
  - **Framework:** React
  - **Routing:** React Router for handling navigation
  - **State Management:** Context API or Redux (if needed)
  - **Additional Libraries:** React Dropzone for file uploads

- **Backend:**
  - **Framework:** Flask
  - **ORM:** SQLAlchemy for database interactions
  - **Authentication:** JWT (JSON Web Tokens) for secure authentication
  - **API Design:** RESTful API conventions

- **Database:**
  - **Type:** SQL (PostgreSQL recommended due to its strong support with SQLAlchemy)

## Features

- Dynamic user registration and login system.
- Ability to post, update, and delete items.
- Favorites and feedback system to engage users.
- Integration of React Dropzone for image uploads.

## Stretch Goals

- Implement a direct messaging system for user communication.
- Add a map view to visually locate items.
- Track and display claimed items to monitor successful exchanges.

## Setup Instructions

To get Curble running locally on your machine, follow these steps divided into front-end and back-end setups:

### Front-End Setup

1. Open your terminal and navigate to the front-end directory of the project (assuming it's called `client`):

`cd client`

2. Install all dependencies using npm:

`npm install`

3. Start the front-end application:

`npm start`

This command will run your React application and usually opens a browser window automatically to `localhost:3000`.

### Back-End Setup

1. Install all required Python packages using Pipenv:

`pipenv install`

2. Activate the virtual environment:

`pipenv shell`

3. Open a new terminal window and navigate to the back-end directory of the project (assuming it's called `server`):

`cd server`

4. (Optional) Run any seed scripts to populate your database with initial data:

`python seed.py`

5. Start the back-end server:

`python app.py`

This will typically run your back-end on `localhost:5000`.

Follow these instructions to set up both parts of the Curble application. Ensure both the front-end and back-end servers are running simultaneously to fully utilize the app's functionalities.

## License

Distributed under the MIT License. See `LICENSE` for more information.