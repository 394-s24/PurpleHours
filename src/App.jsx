import './App.css';
import Queue from './components/Queue.jsx';
import 'firebase/database';
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHMX3LqauP2z1mdng1xgaeHRf5qjAA9bY",
  authDomain: "purple-hours.firebaseapp.com",
  databaseURL: "https://purple-hours-default-rtdb.firebaseio.com",
  projectId: "purple-hours",
  storageBucket: "purple-hours.appspot.com",
  messagingSenderId: "289069179177",
  appId: "1:289069179177:web:91b16f6e4da77b7f611738"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const queueData = [
  { name: 'Ella', issue: "My code doesn't work", time: '1:27 PM' },
];

const App = () => {
  return <Queue queue={queueData} />;
};

export default App;
