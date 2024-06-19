# Programmerings eksamen juni 2024 - Frontend
By Emil Vennervald Nielsen

Made with [React](https://react.dev/), [TypeScript](https://typescriptlang.org/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)

Backend repository: [prog-exam-backend](https://github.com/emilvn/prog-exam-backend)

## Setup
Clone the repository, and navigate to the project directory
```bash
git clone https://github.com/emilvn/prog-exam-frontend.git
cd prog-exam-frontend
```
Install dependencies
```bash
npm install
```
Set up a `.env` file with the following content: *(Change the API URL to the URL of backend server if it's not running on localhost:8080)*
```dotenv
VITE_API_URL=http://localhost:8080
```
Run the development server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser to view the running application