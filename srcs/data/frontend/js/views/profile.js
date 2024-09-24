import { navigationBar } from './fr/navigation.js';
import { DEBUG } from '../app.js';

export async function profileView(container, userID) {
    container.innerHTML = '';
    navigationBar(container); // Add navigation bar

    if (DEBUG) {console.log('Profile view for user:', userID);}




}