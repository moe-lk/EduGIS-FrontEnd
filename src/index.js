import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


// bootstrap
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import './index.css';


import GridLayout from'./GridLayout';
import 'react-leaflet-markercluster/dist/styles.min.css';




ReactDOM.render(
  <GridLayout />,
  document.getElementById('root')
);
