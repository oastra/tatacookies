"use client";
import { useEffect, useRef } from "react";

export default function AddressAutocomplete({
  id = "address",
  value,
  onChangeValue,
  onSelectAddress,
  country = "AU",
  className = "form-input",
  placeholder = "Start typing your address…",
}) {
  const inputRef = useRef(null);
  const listenerRef = useRef(null);
  const removeEventRef = useRef(null);
  const hostRef = useRef(null); // wrapper to host the pac-container we move

  useEffect(() => {
    let mounted = true;
    let attrObs = null; // watches a specific pac for style changes

    const fixPac = (pac) => {
      pac.setAttribute("data-local", "1"); // triggers your CSS override
      Object.assign(pac.style, {
        position: "absolute",
        top: "calc(100% + 4px)",
        left: "0",
        width: "100%",
        transform: "none",
        zIndex: "9999",
      });
    };

    // Move latest pac under our wrapper and keep it fixed there
    const attachLatestPac = () => {
      const pacs = document.querySelectorAll(".pac-container");
      const pac = pacs[pacs.length - 1];
      if (!pac || !hostRef.current) return;

      if (pac.parentElement !== hostRef.current) {
        hostRef.current.appendChild(pac);
      }
      fixPac(pac);

      // Re-apply after Google mutates inline styles
      attrObs?.disconnect?.();
      attrObs = new MutationObserver(() => fixPac(pac));
      attrObs.observe(pac, {
        attributes: true,
        attributeFilter: ["style", "class"],
      });
    };

    const init = async () => {
      if (!mounted || !inputRef.current) return;

      // pick constructor for both loaders
      let AutocompleteCtor;
      if (window.google?.maps?.importLibrary) {
        const { Autocomplete } =
          await window.google.maps.importLibrary("places");
        AutocompleteCtor = Autocomplete;
      } else if (window.google?.maps?.places?.Autocomplete) {
        AutocompleteCtor = window.google.maps.places.Autocomplete;
      } else {
        return;
      }

      const ac = new AutocompleteCtor(inputRef.current, {
        fields: ["address_components", "formatted_address", "geometry"],
        types: ["address"],
        componentRestrictions: { country },
      });

      listenerRef.current = ac.addListener("place_changed", () => {
        if (!mounted) return;
        const place = ac.getPlace();
        const get = (t) =>
          place?.address_components?.find((c) => c.types.includes(t))
            ?.long_name || "";

        const payload = {
          fullAddress: place?.formatted_address || "",
          suburb: get("locality") || get("sublocality") || "",
          postcode: get("postal_code") || "",
          state: get("administrative_area_level_1") || "",
          latLng: place?.geometry?.location
            ? {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              }
            : null,
        };

        if (payload.fullAddress) onChangeValue?.(payload.fullAddress);
        onSelectAddress?.(payload);
      });

      // Observe body for pac creation and immediately attach/position it
      bodyObs.observe(document.body, { childList: true, subtree: true });
      attachLatestPac();
    };

    // Single body observer (declared once)
    const bodyObs = new MutationObserver(attachLatestPac);

    // Start when Google is ready
    const start = () => {
      const ready =
        window.google?.maps?.importLibrary ||
        window.google?.maps?.places?.Autocomplete;

      if (ready) {
        void init();
      } else {
        const onReady = () => void init();
        window.addEventListener("gmaps:loaded", onReady, { once: true });
        removeEventRef.current = () =>
          window.removeEventListener("gmaps:loaded", onReady);
      }
    };

    start();

    // --- cleanup (one return only) ---
    return () => {
      mounted = false;
      listenerRef.current &&
        window.google.maps.event.removeListener(listenerRef.current);
      listenerRef.current = null;

      removeEventRef.current?.();
      removeEventRef.current = null;

      attrObs?.disconnect?.();
      bodyObs.disconnect();

      document
        .querySelectorAll(".pac-container")
        .forEach((el) => el._attrObs?.disconnect?.());
    };
  }, [country, onChangeValue, onSelectAddress]);

  return (
    <div className="relative" ref={hostRef}>
      <input
        id={id}
        ref={inputRef}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        className={className}
        value={value}
        onChange={(e) => onChangeValue?.(e.target.value)}
      />
      {/* pac-container will be moved into this wrapper */}
    </div>
  );
}
