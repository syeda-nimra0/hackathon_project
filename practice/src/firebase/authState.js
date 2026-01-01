import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase.js"  


export function listenAuthState(setUser) {
  return onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
}
