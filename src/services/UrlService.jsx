// src/services/UrlService.js

import axios from 'axios';

const apiUrl = 'https://sh.luisvergara.dev/api/url';

export const createUrl = (UrlOriginal) => {
    const urlOriginal = UrlOriginal;
  return axios.post(`${apiUrl}/create`, { urlOriginal });
};

export const createCustomUrl = (originalUrl,customUrl) => {
    const urlOriginal = originalUrl;
    const shortUrl = customUrl;
    return axios.post(`${apiUrl}/createfull`, { urlOriginal, shortUrl });
  };

export const extendUrl = (lastPart) => {
  const urlOriginal = lastPart;
  return axios.put(`${apiUrl}/extend`, { urlOriginal } );
};


export const deleteUrl = (lastPart) => {
  const urlOriginal = lastPart;
  return axios.delete(`${apiUrl}/delete`,{ data: { urlOriginal } });
};
