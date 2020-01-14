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
            gender: {'Mixed': true, 'Boys': true, 'Girls': true},
            type: {'1AB': false, '1C': false, 'Type 2': false, 'Type 3': false},
            category: {'N': false, 'P': false},
            enableClustering: true


        };

        this.getStyle = this.getStyle.bind(this);
        this.createMarkers = this.createMarkers.bind(this);
        this.getMarkerIconStyle = this.getMarkerIconStyle.bind(this);
        // this.filterSchool = this.filterSchool.bind(this);
        this.searchSchool = this.searchSchool.bind(this);

    }


    componentWillMount() {


        axios.get('./provinces1.geojson').then(response => {

            console.log(response);
            console.log(process.env.REACT_APP_API_ENDPOINT);
            this.setState({provinceData: response.data}, this.forceUpdate());

        });

    }

    componentDidMount() {

        let type_array=[];
        let gender_array=[];
        let category_array=[];

        Object.keys(this.state.type).map((_type) => {
            if (this.state.type[_type] === true) {
                type_array.push(_type);
            }
        });

        Object.keys(this.state.gender).map((_gender) => {
            if (this.state.gender[_gender] === true) {
                gender_array.push(_gender);
            }
        });

        Object.keys(this.state.category).map((_category) => {
            if (this.state.category[_category] === true) {
                category_array.push(_category);
            }
        });


        this.searchSchool(type_array, gender_array, category_array);
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
                <Marker key={school.properties["schoolCensus"]}
                        position={[school.geometry.coordinates[1], school.geometry.coordinates[0]]}
                        icon={this.getMarkerIconStyle(school.properties["schoolType"])}>
                    {school.properties && <Popup>
                        <div>
                            School Census: {school.properties["schoolCensus"]} <br/>
                            School Name: {school.properties["schoolName"]} <br/>
                            Number of Students: {school.properties["numberOfStudents"]} <br/>
                            School Gender Composition: {school.properties["gender"]} <br/>
                            School Type: {school.properties["schoolType"]} <br/>
                            Zone: {school.properties["schoolZone"]} <br/>
                        </div>

                    </Popup>}

                </Marker>
            );
        });

        return markers;

    }

    onChangeCheckbox(e) {

        //console.log(e.target);
        //console.log(e.target.name + " "+ e.target.value);
        console.log(e.target.id);

        let type_array=[];
        let gender_array=[];
        let category_array=[];

        if (e.target.name === "type") {

            let tempType = this.state.type;
            tempType[e.target.id] = !this.state.type[e.target.id];

            this.setState({type: tempType});

        } else if (e.target.name === "gender") {

            let tempGender = this.state.gender;
            tempGender[e.target.id] = !this.state.gender[e.target.id];
            this.setState({gender: tempGender});

        } else if (e.target.name === "category") {

            let tempCategory = this.state.category;
            tempCategory[e.target.id] = !this.state.category[e.target.id];
            this.setState({category: tempCategory});
        }

        Object.keys(this.state.type).map((_type) => {
            if (this.state.type[_type] === true) {
                type_array.push(_type);
            }
        });

        Object.keys(this.state.gender).map((_gender) => {
            if (this.state.gender[_gender] === true) {
                gender_array.push(_gender);
            }
        });

        Object.keys(this.state.category).map((_category) => {
            if (this.state.category[_category] === true) {
                category_array.push(_category);
            }
        });

        this.searchSchool(type_array, gender_array, category_array);

    }


    searchSchool(schoolTypes, schoolGender, schoolCategory) {

        axios.post(process.env.REACT_APP_API_ENDPOINT+"/schools/filter/geo", {
            type: schoolTypes,
            gender: schoolGender,
            category: schoolCategory
        }).then(response=> {
            //console.log(response.data.features);
            this.setState({schools: response.data.features});
        }).catch(error => {
            console.log(error.data);
        });


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
                                <input className="custom-control-input" type="checkbox" name="type" id="1AB"
                                       value="Type 1AB" onChange={this.onChangeCheckbox.bind(this)} defaultChecked={this.state.type['1AB']}/>
                                <label className="custom-control-label" htmlFor="1AB">Type 1AB</label>

                            </div>

                            <div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="type" id="1C"
                                       value="Type 1C" onChange={this.onChangeCheckbox.bind(this)} defaultChecked={this.state.type['1C']}/>
                                <label className="custom-control-label" htmlFor="1C">Type 1C</label>

                            </div>

                            <div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="type" id="Type 2"
                                       value="Type 2" onChange={this.onChangeCheckbox.bind(this)} defaultChecked={this.state.type['Type 2']}/>
                                <label className="custom-control-label" htmlFor="Type 2">Type 2</label>

                            </div>

                            <div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="type" id="Type 3"
                                       value="Type 3" onChange={this.onChangeCheckbox.bind(this)} defaultChecked={this.state.type['Type 3']}/>
                                <label className="custom-control-label" htmlFor="Type 3">Type 3</label>
                            </div>


                            <hr/>
                            <p align="center"> School Category </p>

                            <div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="category"
                                       id="P"
                                       value="P" onChange={this.onChangeCheckbox.bind(this)} defaultChecked={this.state.category['P']}/>
                                <label className="custom-control-label" htmlFor="P">Provincial
                                    School</label>
                            </div>

                            <div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="category"
                                       id="N"
                                       value="N" onChange={this.onChangeCheckbox.bind(this)} defaultChecked={this.state.category['N']}/>
                                <label className="custom-control-label" htmlFor="N">National
                                    School</label>
                            </div>


                            <hr/>

                            <p align="center"> Schools Gender Composition </p>

                            <div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="gender" id="Mixed"
                                       value="Mixed" onChange={this.onChangeCheckbox.bind(this)} defaultChecked={this.state.gender['Mixed']}/>
                                <label className="custom-control-label" htmlFor="Mixed">Mixed Schools</label>
                            </div>

                            <div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="gender" id="Girls"
                                       value="Girls" onChange={this.onChangeCheckbox.bind(this)} defaultChecked={this.state.gender['Girls']}/>
                                <label className="custom-control-label" htmlFor="Girls">Girls Schools</label>
                            </div>

                            <div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="gender" id="Boys"
                                       value="Boys" onChange={this.onChangeCheckbox.bind(this)} defaultChecked={this.state.gender['Boys']}/>
                                <label className="custom-control-label" htmlFor="Boys">Boys Schools</label>
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