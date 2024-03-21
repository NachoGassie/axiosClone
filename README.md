# Open-source Axios clone

## This is a clone with non-commercial interests, for learning purposes only

This project was made to get a deeper understanding of the Feth API and TypeScript functionality.  
Feel free to test out the fetch functions and provide valuable PR.

## To Make a Crud

#### GET
```
import AxiosClone from 'axios-clone';

AxiosClone.get('http://exampleurl')
    .then(res => res.data)
    .catch(err => console.log(err));
```

### DELETE
```
import AxiosClone from 'axios-clone';

AxiosClone.delete('http://exampleurl/id/123');
```

### POST / PUT / PATCH
They receive two obligatory params, the url (as in GET and DELETE) and a body in FormData, JSON and string format.
```
import AxiosClone from 'axios-clone';

const body = {
    email: 'email@mail.com',
    password: 'password',
}

const bodyToSend = 

AxiosClone.post(body, {
    url?: extraUrl
    headers?: { Authorization: `Bearer mytoken` }
    ...
});
```

### Optional Values
You can add params and queries directly to the url

``http://exampleurl/id/123?query=value``

or in Json format
```
{
    queries: { query: value },
    params: { id: 123 },
}
```
In the Json you can as well add timeout in ms, cache to handle the web cache, credentials, mode for cors-mode, headers and a transformResponse function to manipulate the data.
```
{
    queries: { query: value },
    params: { id: 123 },
    timeout: 100,
    cache: 'default',
    credentials: 'same-origin',
    mode: 'cors',
    headers: { "Accept": "application/json" },
    transformResponse: ((data) => console.log(data))
}
```

## Create
Allows to give default and reusable values to every request from an instance

```
const instance = AxiosClone.create({
    baseURL: 'http://exampleurl',
    timeout: 100,
    headers: { Authorization: `Bearer mytoken` }
});

const getReq = await instace.get('',{
    // optional values to add / overWrite
})

const putReq = await instance.put(`/${id}`, body, {
    ...
});
```