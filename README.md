# ByTech Project

## Description

ByTech is a web application that allows users to log in, create accounts, and efficiently manage books through a user-friendly dashboard. Users can assign, delete assignments, add, edit, and delete books with ease.

## Technologies Used

- TypeScript
- React
- Node.js
- Express
- MySQL
- Postman
- Visual Studio Code

## Project Structure

The project consists of frontend and backend components:

- **Frontend:** Developed using React and TypeScript.
- **Backend:** Powered by Node.js and Express, utilizing MySQL for the database.

## Instructions to Run the Project

### Backend

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo/backend
   ```

2. Install dependencies:
```bash
npm install
```

3. Configure the database:

  If you have a password for the root user:

  Open backend/config/config.json and backend/createDataBase.js
  
  Update the password field with your MySQL server password.


4. Start the backend server:

  ```bash
  nodemon index.js
  ```
The backend server should be accessible at http://localhost:3000.


### Frontend

1. In a new terminal window/tab, navigate to the frontend directory:

  ```bash
  cd your-repo/frontend
  ```

2. Install dependencies:

  ```bash
  npm install
  ```
3. Start the frontend development server:
   
  ```bash
  npm start
  ```

The frontend development server should be running at http://localhost:3001.

## Usage

1. Open your web browser and go to http://localhost:3001.
2. Log in or create a new account.
3. Utilize the dashboard to assign, delete assignments, add, edit, and delete books.

## Important Notes

- Ensure to update your MySQL server password in the `backend/config/config.json` and `backend/createDataBase.js` file under the `password` field.
- Make sure both the backend and frontend servers are running concurrently.


---

Made with ❤️ by Lucas 🚀





  

