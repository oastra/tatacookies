"use client";

import React, { useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const AddressAutocomplete = ({ onSelectAddress }) => {
  const [address, setAddress] = useState("");

  const handleSelect = async (value) => {
    setAddress(value);

    try {
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);

      const addressComponents = results[0].address_components;

      const getComponent = (type) =>
        addressComponents.find((comp) => comp.types.includes(type))?.long_name;

      const suburb = getComponent("locality") || getComponent("sublocality");
      const postcode = getComponent("postal_code");
      const state = getComponent("administrative_area_level_1");

      onSelectAddress({
        fullAddress: value,
        suburb,
        postcode,
        state,
        latLng,
      });
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={setAddress}
      onSelect={handleSelect}
      searchOptions={{ componentRestrictions: { country: ["au"] } }}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className="relative">
          <input
            {...getInputProps({
              placeholder: "Start typing address",
              className: "w-full p-2 rounded border border-gray-300",
            })}
          />
          <div className="absolute w-full bg-white border rounded shadow z-10">
            {loading && (
              <div className="p-2 text-sm text-gray-500">Loading...</div>
            )}
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.placeId}
                {...getSuggestionItemProps(suggestion, {
                  className: "p-2 hover:bg-gray-100 cursor-pointer",
                })}
              >
                {suggestion.description}
              </div>
            ))}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default AddressAutocomplete;
