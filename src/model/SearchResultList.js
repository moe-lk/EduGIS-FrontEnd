import React, {Component} from "react";
import {MDBListGroup, MDBListGroupItem} from "mdbreact";
import SearchResult from "./SearchResult";


class SearchResultList extends Component {

    constructor(props) {
        super(props);

    }

    render() {

        return (<div>

            <p align="left"> Search Results </p>

            <MDBListGroup>
                {this.props.searchResults.map(item => (
                    <MDBListGroupItem>{ item }</MDBListGroupItem>
                ))}
            </MDBListGroup>

        </div>);

    }

}

// const Frameworks = (props) => {
//     return (
//         <MDBListGroup>
//             {props.items.map(item => (
//                 <MDBListGroupItem>{ item }</MDBListGroupItem>
//             ))}
//         </MDBListGroup>
//     )
// };

export default SearchResultList;