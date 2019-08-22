import axios from "axios"

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
axios.interceptors.request.use(req => {
    return req;
});
axios.interceptors.response.use(rep => {
    if (rep.status == 200) return rep;
}, err => Promise.reject(err));



export default function (options) {
    return new Promise((resolve, reject) => {
        axios({method: 'get', dataType: 'json', ...options, data: JSON.stringify(options.data) || '' })
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
}