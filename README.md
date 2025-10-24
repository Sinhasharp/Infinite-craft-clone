# My Infinite Craft Clone 🚀

This is my very first take on building a full-stack application, and I'm so excited to share it! I was inspired by the popular "Infinite Craft" game and wanted to see if I could build my own version to learn about Generative AI and databases.

This project is a web-based crafting game where you can combine elements (like "Fire" and "Water") to discover new ones ("Steam"). The combinations are generated in real-time using Google's Gemini API, and all unique discoveries and recipes are stored in a local MongoDB database.

## About This Project

This was a massive learning journey for me! My main goal was to understand how to connect a frontend (what you see) to a backend (the logic) and have that backend talk to both an external API (Gemini) and a database (MongoDB).

-   **Backend:** Built with **Python** and **Flask**. It handles all the logic, talks to the Gemini API, and checks the database.
-   **Frontend:** Built with plain **HTML, CSS, and JavaScript**. It handles all the drag-and-drop interactivity and communicates with my Flask server.
-   **Database:** **MongoDB** stores every successful recipe and every unique element discovered. This means if you combine "Fire" + "Water" to get "Steam:💨", the server remembers this. The next time you make that combo, it pulls from the database instantly instead of asking the AI again!

---

## Features ✨

* **Generative Crafting:** Combine any two elements to generate a new one using the **Gemini API**.
* **Drag & Drop Interface:** A simple, interactive crafting area to drag and drop elements.
* **Persistent Memory:** A **MongoDB** database caches every recipe, ensuring combinations are fast and consistent.
* **Dynamic Discovery List:** Newly discovered elements (like "Steam") are immediately added to your sidebar, ready to be used in new combinations.
* **Full Reset on Refresh:** Every time you load the page, it starts as a fresh "new game" with just the four base elements.

---

## A Quick Note on the Design...

I'll be the first to admit, the frontend design is... well, *functional*! 😅

My entire focus for this first version was on getting the backend logic, the API calls, the database connection, and the frontend interactivity to work perfectly. The UI is very basic and **definitely needs a lot of polishing**, but it's 100% functional for testing and playing the game!

---

## Tech Stack

* **Backend:**
    <br>
    ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
    ![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)

* **Database:**
    <br>
    ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

* **AI:**
    <br>
    ![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white)

* **Frontend:**
    <br>
    ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
    ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
    ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## How to Run This Project Locally

Interested in running it yourself? Here's how:

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Sinhasharp/Infinite-craft-clone.git
    cd Infinite-craft-clone
    ```

2.  **Set Up the Backend**
    ```bash
    cd backend
    
    # Create a virtual environment
    python -m venv venv
    
    # Activate it
    # On Windows:
    .\venv\Scripts\activate
    # On macOS/Linux:
    # source venv/bin/activate
    
    # Install all the required libraries
    pip install -r requirements.txt
    ```

3.  **Add Your API Key**
    * In the `backend/` folder, create a new file named `.env`
    * Open this `.env` file and add your Google Gemini API key:
        ```
        GOOGLE_API_KEY=Your_Secret_API_Key_Goes_Here
        ```

4.  **Set Up the Database**
    * Make sure you have **MongoDB Community Server** installed and running on your local machine.
    * This project is configured to connect to `mongodb://localhost:27018/`. If your database is on a different port, you can change the `MONGO_URI` in `app.py`.

5.  **Run the App!**
    * **Start the Backend:** In your terminal (from the `backend/` folder), run:
        ```bash
        python app.py
        ```
    * **Start the Frontend:** Open the `frontend/` folder and open the `index.html` file in your web browser (using the VS Code "Live Server" extension is highly recommended).

---

## What's Next?

This is just the first step in my journey, and I'm excited to keep building!
* **Polish the UI:** My top priority is to make it look *a lot* better.
* **Add a Search Bar:** The element list will get long, so a search bar is a must.
* **Deployment:** My ultimate goal is to deploy this to a public website so anyone can play it!


###If you like my project be sure sure to comment on it and also suggest me as of how can I make it even better.###
*Thank You*
*Sinhasharp*
