import React, {useState, useEffect} from 'react'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIaiEqTopa8RfAJdJfqedW6ShdX8rQo5k",
  authDomain: "cs378-p4-d8ad7.firebaseapp.com",
  databaseURL: "https://cs378-p4-d8ad7-default-rtdb.firebaseio.com",
  projectId: "cs378-p4-d8ad7",
  storageBucket: "cs378-p4-d8ad7.appspot.com",
  messagingSenderId: "407554084527",
  appId: "1:407554084527:web:b2f93844e6f9c5bf804e5a",
  measurementId: "G-FTHCNZPBF1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

function Main() {
  const[user,setUser] = useState(null);
  const[tasks, setTasks] = useState(null);
  const[loginScreen, setLoginScreen] = useState(true);
  const getData = () => {
    //console.log(this.props.videoTime)
    fetch(`${firebaseConfig.databaseURL + "/" + user.uid}/.json`)
      .then((res) => {
        console.log(res);
        if (res.status !== 200) {
          console.log(res.statusText);
          // throw new Error(res.statusText);
        } else {
          return res.json();
        }
      })
      .then((res) => {
        if (res) {
          console.log("getData res", res);
          setTasks(res);
        }
      });
  };

  const addTask = () => { 
    let task = document.getElementById("taskbox").value;
    document.getElementById("taskbox").value = "";
    if(task === ""){
      return;
    }
    const sampleDict = {
      type: "task",
      date: new Date(),
      text: task,
    };
    return fetch(`${firebaseConfig.databaseURL + "/" + user.uid}/.json`, {
      method: "POST",
      body: JSON.stringify(sampleDict)
    }).then((res) => {
      if (res.status !== 200) {
        console.log(res.statusText);
        // throw new Error(res.statusText);
      } else {
        console.log("success");
        getData();
        return;
      }
    });
  };

  const createUser = () => {
    let email = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        console.log("logged in");
      })
      .catch((error) => {
        console.log(error.code)
        console.log(error.message);
        alert(error.message);
      });
  }

  const login = () => {
    let email = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        setUser(userCredential.user);
        console.log("logged in");
      })
      .catch((error) => {
        alert(error.message);
        console.log(error.code)
        console.log(error.message);
      });
  }

  const logout = () => {
    setUser(null);
    setTasks(null);
  }
    
  useEffect(() => {
    if(user){
      console.log('userdata', user);
      getData();
    }
  }, [user])

  if(!user){
    if(loginScreen){
      return (
        <div className="w-screen h-screen bg-white text-black flex flex-col p-10 items-center justify-center">
           <div className='w-1/3 border-gray-100 border-2 rounded shadow-lg flex flex-col p-8 space-y-4'>
              <div className='text-4xl font-bold mb-8'>Login</div>
              <div className='text-2xl font-bold text-gray-600'>Email</div>
              <input type={"text"} className="text-black p-4 rounded bg-gray-200" id = "username"></input>
              <div className='text-2xl font-bold text-gray-600'>Password</div>
              <input type={"text"} className="text-black p-4 rounded bg-gray-200" id = "password"></input>
              <div className='h-6'></div>
              <button className="bg-fuchsia-100 p-4 text-2xl w-auto font-bold text-gray-700" onClick={() => login()}>Login</button>
              <div className='text-xl underline text-fuchsia-400 cursor-pointer' onClick={() => setLoginScreen(false)}>Create Account</div>
           </div>
        </div>
      )
    }
    else{
      return (
        <div className="w-screen h-screen bg-white text-black flex flex-col p-10 items-center justify-center">
           <div className='w-1/3 border-gray-100 border-2 rounded shadow-lg flex flex-col p-8 space-y-4'>
              <div className='text-4xl font-bold mb-8'>Create Account</div>
              <div className='text-2xl font-bold text-gray-600'>Email</div>
              <input type={"text"} className="text-black p-4 rounded bg-gray-200" id = "username"></input>
              <div className='text-2xl font-bold text-gray-600'>Password</div>
              <input type={"text"} className="text-black p-4 rounded bg-gray-200" id = "password"></input>
              <div className='h-6'></div>
              <button className="bg-fuchsia-100 p-4 text-2xl w-auto font-bold text-gray-700" onClick={() => createUser()}>Create Account</button>
              <div className='text-xl underline text-fuchsia-400 cursor-pointer' onClick={() => setLoginScreen(true)}>Login</div>
           </div>
        </div>
      )
    }
    
  }

  return (
    <div className="w-screen h-screen bg-white text-black flex flex-col p-10 md:px-60 px-4 space-y-4">
       <div className='w-full flex flex-row py-8 justify-between'>
          <div className='text-4xl font-bold'>To Do List</div>
          <div className='flex flex-row items-center'>
            <div className='text-2xl mr-4 font-bold text-gray-700'>{user.email}</div>
            <div className='p-2 text-lg bg-fuchsia-100 rounded cursor-pointer' onClick={() => logout()}>Logout</div>
          </div>
       </div>
       <div className='w-full flex flex-row'>
        <input type={"text"} className="text-black p-4 rounded bg-gray-200 grow mr-2" id ="taskbox"></input>
        <button className="bg-fuchsia-100 p-4 font-xl rounded" onClick={() => addTask()}>Add Item</button>
       </div>
       {tasks && Object.keys(tasks).map((task, i) => {
        return <div className='w-full p-4 border-gray-200 border-2 text-xl flex flex-row' key = {i}>
            <div className='mr-4'>{`${i + 1}.`}</div>
            {tasks[task].text}
          </div>
       })}
       
    </div>
  )
}

export default Main