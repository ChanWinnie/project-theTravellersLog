import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { styling } from "../GlobalStyles";
import { useSelector } from "react-redux";
import {
  onSmallPhoneMediaQuery,
  onTabletMediaQuery,
  onDesktopMediaQuery,
  onLargeDesktopMediaQuery,
} from "../utils/responsives";
import MapGoogle from "../components/map/MapGoogle";

const Explore = () => {
  const userState = useSelector((state) => state);

  const [tripOptions, setTripOptions] = useState([]);
  const [tripCoordinates, setTripCoordinates] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [siteValues, setSiteValues] = useState({
    trip: "",
    name: "",
  });

  const [placesArray, setPlacesArray] = useState([]);
  const [uniquePlacesArray, setUniquePlacesArray] = useState([]);
  const [infoWindowClose, setInfoWindowClose] = useState(false);

  // Get user's trips and map as select options for nearby search
  useEffect(() => {
    setTripOptions(userState?.user?.data?.trips);
  }, [userState]);

  // Once trip is selected, set state of trip coordinates and pass to map component
  // Map component will use object to pan and zoom to selected location
  useEffect(() => {
    const findTripObj = tripOptions.find((tripOption) => {
      return tripOption.name === siteValues.trip;
    });
    //console.log(findTripObj);
    if (findTripObj) {
      setTripCoordinates(findTripObj.coordinates);
    }
  }, [siteValues.trip]);

  // When types (of a category) have been set to state, handle fetch function
  useEffect(() => {
    if (categoryOptions) {
      fetchTypeSites(categoryOptions);
    }
  }, [categoryOptions]);

  // Flatten arrays into one and remove duplicate values
  // Set array to state and pass to map for markers
  useEffect(() => {
    const mergedArray = placesArray.flat();
    //console.log(mergedArray);
    const filteredArray = mergedArray.reduce((acc, current) => {
      const x = acc.find((item) => item.name === current.name);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    setUniquePlacesArray(filteredArray);
  }, [placesArray]);

  // Set selected trip to state
  const handleSelectTrip = (tripName) => {
    setSiteValues((current) => ({
      ...current,
      trip: tripName,
    }));
  };

  const closeInfoWindow = () => {
    setInfoWindowClose(!infoWindowClose);
    // setInfoWindowClose(true);
  };

  // Once user selects category of site they want to visit, set to state the types that are included in each category
  const handleSetCategoryOptions = (type) => {
    //console.log(type);
    closeInfoWindow();
    if (type === "Dining") {
      setCategoryOptions(["bakery", "cafe", "restaurant"]);
    } else if (type === "Lodging") {
      setCategoryOptions(["lodging"]);
    } else if (type === "Night Life") {
      setCategoryOptions(["bar", "casino", "night_club"]);
    } else if (type === "Outdoors") {
      setCategoryOptions(["campground", "park"]);
    } else if (type === "Tourist Attractions") {
      setCategoryOptions(["tourist_attractions", "art_gallery", "museum"]);
    } else if (type === "Shopping") {
      setCategoryOptions(["shopping_mall", "book_store", "department_store"]);
    } else if (type === "Usefuls") {
      setCategoryOptions([
        "bank",
        "atm",
        "pharmacy",
        "embassy",
        "hospital",
        "liqour_store",
        "police",
        "post_office",
      ]);
    }
  };

  // Using selected category, fetch requests of nearby places matching the type parameter (one type per request allowed)
  const fetchTypeSites = (categoryOptions) => {
    // Remove previously added places
    setPlacesArray([]);
    categoryOptions.map((type) => {
      console.log(type);
      return fetch(
        `/getplaces/${tripCoordinates.lat}/${tripCoordinates.lng}/${type}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000/",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      )
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          if (json.status === 200)
            setPlacesArray((current) => [...current, json.message.results]);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  return (
    <Wrapper>
      <FormContainer>
        <form style={{ marginBottom: "25px" }}>
          <Section>
            <div>
              <label>Headed to: </label>
              <select
                style={{ height: "30px", border: "1px solid gray" }}
                onChange={(event) => handleSelectTrip(event.target.value)}
                defaultValue={"DEFAULT"}
              >
                <option value="DEFAULT" disabled>
                  Select your trip
                </option>
                {tripOptions?.map((tripOption) => {
                  return (
                    <option key={tripOption.name} value={tripOption.name}>
                      {tripOption.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label style={{ marginLeft: "15px" }}>Looking for: </label>
              <select
                onChange={(event) =>
                  handleSetCategoryOptions(event.target.value)
                }
                defaultValue={"DEFAULT"}
                style={{ height: "30px", border: "1px solid gray" }}
              >
                <option value="DEFAULT" disabled>
                  Select your type
                </option>
                <option value="Dining">Dining</option>
                <option value="Lodging">Lodging</option>
                <option value="Night Life">Night Life</option>
                <option value="Outdoors">Outdoors</option>
                <option value="Tourist Attractions">Tourist Attractions</option>
                <option value="Shopping">Shopping</option>
                <option value="Usefuls">Usefuls</option>
              </select>
            </div>
          </Section>
        </form>
      </FormContainer>
      <MapGoogle
        showSearchBar={false}
        selectedTripCoordinates={tripCoordinates}
        uniquePlacesArray={uniquePlacesArray}
        setSiteValues={setSiteValues}
        infoWindowClose={infoWindowClose}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 80%;
  height: 100vh;

  margin: 20px auto 0 auto;

  border-radius: ${styling.borderRadius};
  background-color: ${styling.backgroundColor};

  ${onTabletMediaQuery()} {
    padding: 15px;
  }
  ${onDesktopMediaQuery()} {
    padding: 25px 15px 0px 15px;
  }
  ${onLargeDesktopMediaQuery()} {
    padding: 25px 15px 0px 15px;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 15px 0;
  font-weight: bold;
`;

const Section = styled.div`
  display: flex;
  line-height: 2.5;

  ${onSmallPhoneMediaQuery()} {
    flex-direction: column;
    align-items: center;
  }
  ${onTabletMediaQuery()} {
    flex-direction: column;
    align-items: center;
  }
`;

export default Explore;
