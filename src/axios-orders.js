import axios from 'axios'; 

const instance = axios.create({
    baseURL: 'https://my-burger-builder-af261.firebaseio.com/'
});

export default instance;