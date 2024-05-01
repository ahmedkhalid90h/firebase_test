import { initializeApp } from 'firebase/app'
import { 
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    getDoc, updateDoc
} from 'firebase/firestore'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBMqxCDpKBK_PDsX57_R5jHMKSpfrvYjXc",
    authDomain: "fir-d6c5e.firebaseapp.com",
    projectId: "fir-d6c5e",
    storageBucket: "fir-d6c5e.appspot.com",
    messagingSenderId: "451359281794",
    appId: "1:451359281794:web:810a6ece6139006c641a9b"
};

initializeApp(firebaseConfig)

const db = getFirestore()

const auth = getAuth()

// v1
const colRef = collection(db, 'books')

// v2 

const q = query(colRef, orderBy('createdAt'))


//  v1

// getDocs(colRef).then(
//     (snapshot) => {
//         let books = []
//         snapshot.docs.forEach((doc) => {
//             books.push({ ...doc.data(), id: doc.id })
//         })
//         console.log(books)
//     }
// ).catch(e => console.log(e.message)) 


// v2


const unsubCol = onSnapshot(q, (snapshot) => {
    let books = []
    snapshot.docs.forEach(doc => {
        books.push({ ...doc.data(), id: doc.id })
    })
    console.log(books)
})



const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault()
    addDoc(colRef, {
        title: addBookForm.tilte.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    })
    .then(() => {
        addBookForm.reset()
    })
})


const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    const docRef = doc(db, 'books', deleteBookForm.id.value)

    deleteDoc(docRef)
    .then(() => {
        deleteBookForm.reset()
    })
})


const docRef = doc(db, 'books', "0VHUq8HgnkyBZxy09Zue")

// getDoc(docRef).then((doc) => {
//     console.log(doc.data(), doc.id)
// })

const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
})



const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', updateForm.id.value)
    updateDoc(docRef, {
        title: 'updated title'
    })
    .then(() => {
        updateForm.reset()
    })
})



const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value
    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log('user created', cred.user)
            signupForm.reset()
    }).catch((e) => {
        console.log(e.message)
    })
})


const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
    signOut(auth)
    .then(() => {
        console.log('user signed out')
    })
    .catch(err => {
        console.log(err.message)
    })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    const email = loginForm.email.value
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log('user login: ', cred.user)
            loginForm.reset()
    }).catch((e) => {
        console.log(e.message)
    })
})

const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user satus change: ', user)
})


const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
    console.log('Unsubscribing')
    unsubCol()
    unsubDoc()
    unsubAuth()
})