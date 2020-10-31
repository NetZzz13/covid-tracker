import React from "react";
import "../scss/Map.scss";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import { showDataonMap } from "../utils/utils";
import { Marker } from "react-leaflet";

/* const MyMarker = props => {

  const initMarker = ref => {
    if (ref) {
      ref.leafletElement.openPopup()
    }
  }

  return <Marker ref={initMarker} {...props}/>
} */

const Map = ({ countries, casesType, center, zoom }) => {
  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Loop through countries and draw circles */}
        {showDataonMap(countries, casesType)}
        
      </LeafletMap>
    </div>
  );
};

export default Map;
