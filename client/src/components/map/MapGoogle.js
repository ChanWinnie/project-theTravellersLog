import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { mapStyle } from "./style";
import styled from "styled-components";
import usePlacesAutocomplete, {
  getLatLng,
  getGeocode,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { BsStarFill } from "react-icons/bs";
import { RiPriceTag3Fill } from "react-icons/ri";
import { MdLocationOn } from "react-icons/md";

const containerStyle = {
  width: "100%",
  height: "65vh",
  borderRadius: "3px",
  margin: "auto",
};

let center = {
  lat: 45.5017,
  lng: -73.561668,
};

const apiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
const libraries = ["places"];
const options = { styles: mapStyle, disableDefaultUI: true, zoomControl: true };

const MapGoogle = ({
  setCoordinates,
  setLocation,
  showSearchBar,
  selectedTripCoordinates,
  uniquePlacesArray,
  setSiteValues,
  infoWindowClose,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const [displayMarkers, setDisplayMarkers] = useState([]);
  const [selected, setSelected] = useState(null);

  // If selectedTripCoordinates contains an object of coordinates (passed from Explore), call panTo function
  useEffect(() => {
    // Need condition because it's triggered even if selectedTripCoordinates is null/undefined
    if (selectedTripCoordinates) {
      panTo(selectedTripCoordinates, 14);
    }
  }, [selectedTripCoordinates]);

  // When uniquePlacesArray is received, set to state with only object keys that we want
  useEffect(() => {
    // Clear previously set markers
    setDisplayMarkers([]);

    uniquePlacesArray?.map((place) => {
      //console.log(place.geometry.location);
      return setDisplayMarkers((current) => [
        ...current,
        {
          coordinates: place.geometry.location,
          name: place.name,
          address: place.vicinity,
          rating: place.rating,
          raters: place.user_ratings_total,
          pricing: place.price_level,
        },
      ]);
    });
  }, [uniquePlacesArray]);

  useEffect(() => {
    if (infoWindowClose) {
      setSelected(null);
    }
  }, [infoWindowClose]);

  // Reference to map to access without rerender
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }, zoomNum) => {
    mapRef.current?.panTo({ lat, lng });
    mapRef.current?.setZoom(zoomNum);
  });

  const selectMarkerForInfo = (marker) => {
    setSelected(marker);
  };

  if (loadError)
    return <>Error: please refresh your page or try again later </>;
  if (!isLoaded) return <>Loading...</>;

  return (
    <>
      {showSearchBar && (
        <Searchbar
          panTo={panTo}
          setLocation={setLocation}
          setCoordinates={setCoordinates}
        />
      )}

      <GoogleMap
        id="map"
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        options={options}
        onLoad={onMapLoad}
      >
        {displayMarkers.map((marker) => (
          <Marker
            key={marker.name}
            position={{
              lat: marker.coordinates.lat,
              lng: marker.coordinates.lng,
            }}
            title={marker.name}
            onClick={() => {
              selectMarkerForInfo(marker);
              setSiteValues((current) => ({
                ...current,
                name: marker.name,
              }));
            }}
          />
        ))}
        {selected ? (
          <InfoWindow
            position={{
              lat: selected.coordinates.lat,
              lng: selected.coordinates.lng,
            }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <InfoContainer>
              <h3 style={{ fontSize: "16px" }}>{selected.name}</h3>
              {selected.address && (
                <p>
                  <MdLocationOn color={"#237FBF"} size={12} />{" "}
                  {selected.address}
                </p>
              )}
              {selected.rating && (
                <p>
                  <span style={{ fontWeight: "bold" }}>Rated:</span>{" "}
                  {selected.rating} <BsStarFill color={"orange"} size={10} /> by{" "}
                  {selected.raters} visitors
                </p>
              )}
              {selected.pricing && (
                <p>
                  <span style={{ fontWeight: "bold" }}>Pricing:</span>{" "}
                  {selected.pricing}{" "}
                  <RiPriceTag3Fill color={"green"} size={10} />
                </p>
              )}
            </InfoContainer>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </>
  );
};

// Searchbar component also found here:
const Searchbar = ({ panTo, setLocation, setCoordinates }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 45.5017, lng: () => -73.561668 },
      // *wants to receive a function it can call to get value so convert to arrow function
      radius: 2000,
    },
  });

  const handleInput = (event) => {
    setValue(event.target.value);
  };

  const handleOnSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    console.log("select");

    try {
      const results = await getGeocode({ address });
      // console.log(results);
      const { lat, lng } = await getLatLng(results[0]);
      // console.log(lat, lng);
      setLocation(results[0].formatted_address);
      setCoordinates({ lat, lng });
      panTo({ lat, lng }, 12);
    } catch (error) {
      console.log("😱 Error: ", error);
    }
  };

  return (
    <ComboBoxWrapper>
      <Combobox onSelect={(address) => handleOnSelect(address)}>
        <ComboboxInput
          value={value}
          onChange={(event) => handleInput(event)}
          disabled={!ready}
          placeholder="Enter your destination"
          style={{
            height: "20px",
            padding: "5px 8px",
            fontFamily: "Open Sans",
          }}
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption
                  key={id}
                  value={description}
                  style={{ fontFamily: "Open Sans" }}
                />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </ComboBoxWrapper>
  );
};

const ComboBoxWrapper = styled.div`
  z-index: 2;
  position: absolute;
  padding: 5px;
  // To center:
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const InfoContainer = styled.div`
  padding: 10px;
  line-height: 1.75;

  &p {
    font-size: 12px;
  }
`;

export default MapGoogle;
