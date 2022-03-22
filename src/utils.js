
// ************************************************
// THIS PAGE REQUIRES EXPERIMENTER INPUT
// ************************************************

// don't change these import statements
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/performance";
import "firebase/analytics";
import { writable } from 'svelte/store';

// ************************************************
// ************************************************
// ************************************************
// ************************************************
// USER VARIABLES (FILL STUFF IN BELOW THIS LINE)
// ************************************************
// ************************************************
// ************************************************
// ************************************************

// lab variables
export const studyLocation = 'moore'; // location of lab running mturk study
export const labName = 'cosan'; // name of lab running HIT experiment 
export const email = 'wasita.gr@dartmouth.edu'; // lab email for mturk
export const studyAim = 'aim of study'; // aim of mturk study 
export const studyTasks = 'brief HIT summary'; // brief summary of HIT task for consent form
export const experiment = 'svelte-exp-test'; // name of experiment (should match collection name in firebase)

// HIT variables
export const HITPay = '3.00'; // pay for HIT completion (format as X.XX with no dollar sign)
export const userGroup = 'collection'; // name of collection of participants for current HIT
export const estHITTime = '30'; // estimated time to complete HIT (in minutes)
export const totalHITTime = estHITTime * 2; // total time provided for HIT (in minutes)

// stimuli variables      
export const ratingTypes = ['good', 'bad', 'blah']; // array of rating types   

// this configures path to proper firebase
// COPY AND PASTE YOUR FIREBASE CONFIG HERE
let firebaseConfig = {
  apiKey: "AIzaSyBVjNBhdBK8CwtMpWEIjlJxQF5DDX2dmhU",
  authDomain: "continuous-rater-demo.firebaseapp.com",
  databaseURL: "https://continuous-rater-demo-default-rtdb.firebaseio.com",
  projectId: "continuous-rater-demo",
  storageBucket: "continuous-rater-demo.appspot.com",
  messagingSenderId: "861777413042",
  appId: "1:861777413042:web:d7511693072fecb40e1aab"
};
// ************************************************
// ************************************************
// ************************************************
// ************************************************
// STOP. DON'T CHANGE ANYTHING BELOW THIS LINE
// ************************************************
// ************************************************
// ************************************************
// ************************************************

// dev is referenced as a store elsewhere in the code, so cannot be a simple Boolean
// eslint-disable-next-line no-undef
export const dev = DEV_MODE ? writable(true) : writable(false);

// firebase info (export for use elsewhere in app)
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const auth = firebase.auth();
export const serverTime = firebase.firestore.Timestamp.now();

// Functions to parse the URL to get workerID, hitID, and assignmentID
const unescapeURL = (s) => decodeURIComponent(s.replace(/\+/g, '%20'));
export const getURLParams = () => {
    const params = {};
    let url = window.location.href;
    let m = window.location.href.match(/[\\?&]([^=]+)=([^&#]*)/g);
    
    if (m) {
        let i = 0;
        while (i < m.length) {
            const a = m[i].match(/.([^=]+)=(.*)/);
            params[unescapeURL(a[1])] = unescapeURL(a[2]);
            i += 1;
        }
    }
    if (!params.workerId && !params.assignmentId && !params.hitId) {
        // eslint-disable-next-line no-undef
        if (DEV_MODE) {
            console.log(
                'App running in dev mode so HIT submission will not work!\nTo test in the sandbox make sure to deploy the app.'
            );
            params.workerId = 'test-worker';
            params.assignmentId = 'test-assignment';
            params.hitId = 'test-hit';
            params.turkSubmitTo = 'test-submit';
        }
    }
    return params;
};

// Use those functions to get the window URL params and make them available throughout the app
export const params = getURLParams();