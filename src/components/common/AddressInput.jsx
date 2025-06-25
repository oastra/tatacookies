"use client";

import { useEffect, useRef, useState } from "react";

const AddressInput = () => {
  const inputRef = useRef(null);
  const [place, setPlace] = useState(null);

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        const { Autocomplete } = await google.maps.importLibrary("places");

        const autocomplete = new Autocomplete(inputRef.current, {
          fields: ["place_id", "displayName", "formattedAddress"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          setPlace(place);
          console.log("📍 Selected place:", place);
        });
      } catch (err) {
        console.error("Google Maps API failed to load:", err);
      }
    };

    if (window.google?.maps?.importLibrary) {
      initAutocomplete();
    }
  }, []);

  return (
    <>
      <input
        ref={inputRef}
        placeholder="Search address"
        className="border p-2 w-full"
        type="text"
      />
      {place && (
        <div className="mt-4">
          <div>
            <strong>Name:</strong> {place.displayName?.text}
          </div>
          <div>
            <strong>Address:</strong> {place.formattedAddress?.text}
          </div>
        </div>
      )}
    </>
  );
};

export default AddressInput;
// This component initializes a Google Maps Autocomplete input field
// and displays the selected place's name and address.
