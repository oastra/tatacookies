"use client";

import { useEffect, useRef } from "react";

const AddressAutocomplete = ({ onSelectAddress }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const initAutocomplete = async () => {
      const { Autocomplete } = await window.google.maps.importLibrary("places");

      const autocomplete = new Autocomplete(inputRef.current, {
        fields: ["address_components", "formatted_address", "geometry"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        console.log("🔥 Raw Google Place Object:", place);

        const getComponent = (type) =>
          place.address_components?.find((c) => c.types.includes(type))
            ?.long_name || "";

        const addressData = {
          fullAddress: place.formatted_address || "",
          suburb: getComponent("locality") || getComponent("sublocality") || "",
          postcode: getComponent("postal_code") || "",
          state: getComponent("administrative_area_level_1") || "",
          latLng: place.geometry?.location
            ? {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              }
            : null,
        };

        console.log("✅ Parsed Address Data:", addressData);

        if (addressData.fullAddress) {
          onSelectAddress(addressData);
        }
      });
    };

    if (window.google?.maps?.importLibrary && inputRef.current) {
      initAutocomplete();
    }
  }, [onSelectAddress]);

  return (
    <input
      ref={inputRef}
      type="text"
      autoComplete="off"
      placeholder="Start typing your address..."
      className="form-input"
    />
  );
};

export default AddressAutocomplete;
