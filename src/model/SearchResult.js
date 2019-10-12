import React, {Component} from 'react';
import {MDBListGroupItem} from "mdbreact";


class SearchResult extends Component {

    constructor(props) {
        super(props);

    }

    render() {

        return (<MDBListGroupItem>{this.props.schoolName}</MDBListGroupItem>);

    }

}
export default SearchResult;
