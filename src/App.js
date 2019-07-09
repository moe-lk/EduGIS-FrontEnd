import React, {Component} from 'react';
import {Map as LeafletMap, Marker, TileLayer, GeoJSON, Popup} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster/dist/react-leaflet-markercluster';
import L from 'leaflet';
import {renderToStaticMarkup} from 'react-dom/server';
import axios from 'axios';

//import {Bounds, Point, LatLngBounds} from 'leaflet';

//import districtdata from './sl_provinces.geojson';

class App extends Component {

    constructor() {
        super();
        this.state = {
            lat: 7.873100,
            lng: 80.771800,
            zoom: 8,
            provinceData: null,
            schools: null,
            markerClusterGroups: [[]]
            // bounds: Bounds([[9.849070, 79.175759], [5.870270, 82.814672]])
        };

        this.getStyle = this.getStyle.bind(this);
        this.createMarkers = this.createMarkers.bind(this);
        this.getMarkerIconStyle = this.getMarkerIconStyle.bind(this);
    }

    componentWillMount() {


        axios.get('./provinces1.geojson').then(response => {

            console.log(response);
            this.setState({provinceData: response.data}, this.forceUpdate());

        });

        axios.get('./schools.geojson').then(response => {

            console.log(response);
            this.setState({schools: response.data.features});


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


    onEachFeature(feature, layer) {
        layer.on({
            mouseover: this.highlightFeature.bind(this),
            //mouseout: this.resetHighlight.bind(this),
            click: this.clickToFeature.bind(this)
        });
    }


    /***************Event handling********************/

    highlightFeature(e) {
        let layer = e.target;
        console.log("I clicked on " + layer.feature.properties.name_1);


    }

    clickToFeature(e) {

        console.log(e.target);
    }

    onclusterMouseOver(e) {
        console.log(e);

    }

    onclusterMouseOut(e) {
        console.log(e);

    }

    /*************End Event handling functions************************************/



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

                <div className="row" style={{height: 100 + 'px'}}>


                    <div className="row">
                        <p> Legend </p> <br />
                        <input type="checkbox" name="schooltype" id="type-ab" /><label htmlFor="scales">Type</label>

                    </div>

                </div>

                <LeafletMap center={position} zoom={this.state.zoom} maxZoom={17}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    />

                    {/*{this.state.provinceData && <GeoJSON data={this.state.provinceData} style={this.getStyle} />}*/}

                    {/*{this.state.schools && <GeoJSON data={this.state.schools} onEachFeature={this.onEachFeature.bind(this)}/>}*/}


                    {/*onClustermouseout={this.onclusterMouseOut.bind(this)}*/}

                    {this.state.schools && <MarkerClusterGroup
                        iconCreateFunction={createClusterCustomIcon}
                        disableClusteringAtZoom={12}
                        zoomToBoundsOnClick={true}>

                        {this.createMarkers()}

                    </MarkerClusterGroup>}


                </LeafletMap>
            </div>

        );
    }
}

export default App;
