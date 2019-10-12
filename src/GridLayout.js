import React, {Component} from 'react';
import {MDBBadge, MDBCol, MDBContainer, MDBListGroup, MDBListGroupItem, MDBRow} from "mdbreact";
import {Circle, CircleMarker, FeatureGroup, Map as LeafletMap, Marker, Popup, TileLayer} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster/dist/react-leaflet-markercluster";
import L from "leaflet";
import axios from "axios";
import {EditControl} from "react-leaflet-draw"
import Control from 'react-leaflet-control';
import SearchResult from './model/SearchResult';
import SearchResultList from './model/SearchResultList';
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


        this.getStyle = this.getStyle.bind(this);
        this.createMarkers = this.createMarkers.bind(this);
        this.getMarkerIconStyle = this.getMarkerIconStyle.bind(this);
        // this.filterSchool = this.filterSchool.bind(this);
    }


    componentWillMount() {


        axios.get('./provinces1.geojson').then(response => {

            console.log(response);
            this.setState({provinceData: response.data}, this.forceUpdate());

        });

        axios.get('./schools.geojson').then(response => {

            console.log(response);
            this.setState({schools: response.data.features, allSchools: response.data.features});


        });

    }


    getMarkerIconStyle(schoolType) {

        let myCustomColour = '#583470';

        if (schoolType === "1AB")
            myCustomColour = '#c6783b';
        else if (schoolType === "1C")
            myCustomColour = '#d44792';
        else if (schoolType === "Type 2")
            myCustomColour = '#59b6ca';
        else if (schoolType === "Type 3")
            myCustomColour = '#332770';

        const markerHtmlStyles = `
                  background-color: ${myCustomColour};
                  width: 1.2rem;
                  height: 1.2rem;
                  display: block;
                  left: -0.3rem;
                  top: -0.3rem;
                  position: relative;
                  border-radius: 1.2rem 1.2rem 0;
                  transform: rotate(45deg);
                  border: 1px solid #FFFFFF`

        return L.divIcon({
            iconAnchor: [0, 24],
            labelAnchor: [-6, 0],
            popupAnchor: [0, -36],
            html: `<span style="${markerHtmlStyles}" />`
        })

    }


    getStyle(feature) {


        return {
            color: '#000000',
            weight: 1,
            opacity: 0.3,
            fillOpacity: 0.1
        }
    }

    createMarkers() {

        let markers = [];

        this.state.schools.map((school, index) => {
            markers.push(
                <Marker key={school.properties["School Census"]}
                        position={[school.geometry.coordinates[1], school.geometry.coordinates[0]]}
                        icon={this.getMarkerIconStyle(school.properties["Type"])}>
                    {school.properties && <Popup>
                        <div>
                            School Census: {school.properties["School Census"]} <br/>
                            School Name: {school.properties["School Name"]} <br/>
                            Number of Students: {school.properties["Number of Students"]} <br/>
                            School gender: {school.properties["School gender"]} <br/>
                            School Type: {school.properties["Type"]} <br/>
                            Zone: {school.properties["Zone"]} <br/>
                        </div>

                    </Popup>}

                </Marker>
            );
        });

        return markers;

    }


    render() {
        const position = [this.state.lat, this.state.lng];

        const createClusterCustomIcon = (cluster) => {
            const count = cluster.getChildCount();

            let size = 'LargeXL';

            if (count < 10) {
                size = 'Small';
            } else if (count >= 10 && count < 100) {
                size = 'Medium';
            } else if (count >= 100 && count < 500) {
                size = 'Large';
            }
            const options = {
                cluster: `markerCluster${size}`,
            };

            return L.divIcon({
                html:
                    `<div class="${options.cluster}">
                    <span class="markerClusterLabel"> ${count}</span>
                  </div>`,
                className: `${options.cluster}`,
            });
        };

        return (
            <div>

                <header>

                    <nav className="navbar fixed-top navbar-expand-lg navbar-dark blue scrolling-navbar">
                        <a className="navbar-brand" href="#"><strong>GIS Application</strong></a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                                data-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent" aria-expanded="false"
                                aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </nav>

                </header>


                <MDBContainer>

                    <MDBRow>
                        <MDBCol md="2">

                            <div className="active-cyan-4 mb-4">
                                <input className="form-control" type="text" placeholder="Search School or Zone"
                                       aria-label="Search"/>
                            </div>

                                <SearchResultList searchResults={['school1', 'school 2', 'school 3']}/>

                            <hr/>

                            <p align="center"> School Type </p>

                            <div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="type" id="type-1ab"
                                       value="Type 1AB"/>
                                <label className="custom-control-label" htmlFor="type-1ab">Type 1AB</label>

                            </div>

                            <div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="type" id="type-1c"
                                       value="Type 1C"/>
                                <label className="custom-control-label" htmlFor="type-1c">Type 1C</label>

                            </div>

                            <div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="type" id="type-2"
                                       value="Type 2"/>
                                <label className="custom-control-label" htmlFor="type-2">Type 2</label>

                            </div>

                            <div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="type" id="type-3"
                                       value="Type 3"/>
                                <label className="custom-control-label" htmlFor="type-3">Type 3</label>
                            </div>


                            <hr/>
                            <p align="center"> School Category </p>

                            <div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="category"
                                       id="category-provincial"
                                       value="Category 1"/>
                                <label className="custom-control-label" htmlFor="category-provincial">Provincial
                                    School</label>
                            </div>

                            <div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="category"
                                       id="category-national"
                                       value="Category 2"/>
                                <label className="custom-control-label" htmlFor="category-national">National
                                    School</label>
                            </div>


                            <hr/>

                            <p align="center"> Schools Gender Composition </p>

                            <div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="gender" id="gender-mixed"
                                       value="Mixed"/>
                                <label className="custom-control-label" htmlFor="gender-mixed">Mixed Schools</label>
                            </div>

                            <div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="gender" id="gender-girls"
                                       value="Girls"/>
                                <label className="custom-control-label" htmlFor="gender-girls">Girls Schools</label>
                            </div>

                            <div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="gender" id="gender-boys"
                                       value="Boys"/>
                                <label className="custom-control-label" htmlFor="gender-boys">Boys Schools</label>
                            </div>


                        </MDBCol>

                        <MDBCol md="8" className="col-map">

                            <LeafletMap center={position} zoom={this.state.zoom} maxZoom={17}>
                                <TileLayer
                                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
                                />


                                {this.state.enableClustering && this.state.schools && <MarkerClusterGroup
                                    iconCreateFunction={createClusterCustomIcon}
                                    disableClusteringAtZoom={12}
                                    zoomToBoundsOnClick={true}>

                                    {this.createMarkers()}

                                </MarkerClusterGroup>}

                                {!this.state.enableClustering && this.state.schools && this.createMarkers()}


                                <FeatureGroup>
                                    <EditControl
                                        position='topright'
                                        // onEdited={this._onEditPath}
                                        // onCreated={this._onCreate}
                                        // onDeleted={this._onDeleted}
                                        draw={{
                                            rectangle: false
                                        }}
                                    />

                                </FeatureGroup>

                                <Control position="topleft">
                                    <div className="legend">
                                        <h4>School Types</h4>
                                        <i style={{background: "#c6783b"}}/><span>Type 1AB</span> <br/>
                                        <i style={{background: "#d44792"}}/><span>Type 1C</span> <br/>
                                        <i style={{background: "#59b6ca"}}/><span>Type 2</span> <br/>
                                        <i style={{background: "#332770"}}/><span>Type 3</span> <br/>

                                    </div>
                                </Control>


                            </LeafletMap>

                        </MDBCol>


                        <MDBCol md="2">

                            <p align="center"> Summary </p>

                            <MDBListGroup className="list-group-summary">
                                <MDBListGroupItem
                                    className="d-flex justify-content-between align-items-center">Schools<MDBBadge
                                    color="primary"
                                    pill>4</MDBBadge>
                                </MDBListGroupItem>
                                <MDBListGroupItem className="d-flex justify-content-between align-items-center">Students<MDBBadge
                                    color="primary" pill>1100</MDBBadge>
                                </MDBListGroupItem>
                                <MDBListGroupItem className="d-flex justify-content-between align-items-center">Teachers<MDBBadge
                                    color="primary"
                                    pill>60</MDBBadge>
                                </MDBListGroupItem>
                            </MDBListGroup>

                            <hr/>

                            <p align="center"> Results </p>

                            <MDBListGroup className="list-group-results">
                                <MDBListGroupItem>PAMUNUGAMA MAHA VIDYALAYA (Type 1C)</MDBListGroupItem>
                                <MDBListGroupItem>GONSALVEZ MAHA VIDYALAYA (Type 1C)</MDBListGroupItem>
                                <MDBListGroupItem>ST MARY'S MAHA VIDYALAYA (Type 1C)</MDBListGroupItem>
                                <MDBListGroupItem>ST.ANN'S MAHA VIDYALAYA (Type 1C)</MDBListGroupItem>
                                <MDBListGroupItem>VPITIPANA MAHA VIDYALAYA (Type 1C)</MDBListGroupItem>
                                <MDBListGroupItem>Cras justo odio</MDBListGroupItem>
                                <MDBListGroupItem>Dapibus ac facilisis in</MDBListGroupItem>
                                <MDBListGroupItem>Morbi leo risus</MDBListGroupItem>
                                <MDBListGroupItem>Porta ac consectetur ac</MDBListGroupItem>
                                <MDBListGroupItem>Vestibulum at eros</MDBListGroupItem>
                                <MDBListGroupItem>Cras justo odio</MDBListGroupItem>
                                <MDBListGroupItem>Dapibus ac facilisis in</MDBListGroupItem>
                                <MDBListGroupItem>Morbi leo risus</MDBListGroupItem>
                                <MDBListGroupItem>Porta ac consectetur ac</MDBListGroupItem>
                                <MDBListGroupItem>Vestibulum at eros</MDBListGroupItem>
                                <MDBListGroupItem>Cras justo odio</MDBListGroupItem>
                                <MDBListGroupItem>Dapibus ac facilisis in</MDBListGroupItem>
                                <MDBListGroupItem>Morbi leo risus</MDBListGroupItem>
                                <MDBListGroupItem>Porta ac consectetur ac</MDBListGroupItem>
                                <MDBListGroupItem>Vestibulum at eros</MDBListGroupItem>
                            </MDBListGroup>


                        </MDBCol>
                    </MDBRow>

                </MDBContainer>

            </div>

        );
    }
}

export default GridLayout;