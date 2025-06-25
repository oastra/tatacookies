"use client";

import { useEffect, useRef, useState } from "react";

const AddressAutocomplete = ({ onSelectAddress }) => {
  const inputRef = useRef(null);
  const [placeObj, setPlaceObj] = useState(null);

  useEffect(() => {
    const initAutocomplete = async () => {
      const { Autocomplete } = await google.maps.importLibrary("places");

      const autocomplete = new Autocomplete(inputRef.current, {
        fields: ["addressComponents", "formattedAddress", "geometry"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        setPlaceObj(place);

        const getComponent = (type) =>
          place.addressComponents?.find((c) => c.types.includes(type))
            ?.longText || "";

        const addressData = {
          fullAddress: place.formattedAddress?.text || "",
          suburb: getComponent("locality") || getComponent("sublocality") || "",
          postcode: getComponent("postal_code"),
          state: getComponent("administrative_area_level_1"),
          latLng: {
            lat: place.geometry?.location?.lat(),
            lng: place.geometry?.location?.lng(),
          },
        };

        onSelectAddress?.(addressData);
      });
    };

    if (window.google?.maps?.importLibrary) {
      initAutocomplete();
    }
  }, [onSelectAddress]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Start typing your address..."
      className="form-input"
    />
  );
};

export default AddressAutocomplete;
