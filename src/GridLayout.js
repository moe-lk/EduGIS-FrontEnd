import React, {Component} from 'react';
import {MDBContainer, MDBRow, MDBCol} from "mdbreact";
import App from "./App";
import {Map as LeafletMap, TileLayer} from "react-leaflet";

// import './index.css';

class GridLayout extends Component {


    constructor() {
        super();
        this.state = {
            lat: 7.873100,
            lng: 80.771800,
            zoom: 8,
            provinceData: null,
            allSchools: null,
            schools: null,
            markerClusterGroups: [[]],
            gender: {'gender-mixed': true, 'gender-boys': true, 'gender-girls': true},
            type: {'type-1ab': true, 'type-1c': true, 'type-2': true, 'type-3': true},
            enableClustering: true


        };

    }


    render() {
        const position = [this.state.lat, this.state.lng];


        return (
            <MDBContainer>

                <MDBRow>
                    <MDBCol md="12" className="col">Nav bar</MDBCol>
                </MDBRow>

                <MDBRow>
                    <MDBCol md="2" className="col">
                        <input className="form-control" type="text" placeholder="Search Zones, Schools" aria-label="Search" />



                    </MDBCol>

                    <MDBCol md="8" className="col-map">

                        <LeafletMap center={position} zoom={this.state.zoom} maxZoom={17}>
                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
                            />

                        </LeafletMap>

                    </MDBCol>


                    <MDBCol md="2" className="col">Summary View</MDBCol>
                </MDBRow>

            </MDBContainer>
        );
    }
}

export default GridLayout;