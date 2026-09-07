import axios from "axios";

// Local development — update IP to match your network
//const BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.0.239:3500';
const BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.1.73:3500';



export default axios.create({ baseURL: BASE_URL });

//export default axios.create({baseURL: 'https://ozabackendapi.ozaapp.com'})
