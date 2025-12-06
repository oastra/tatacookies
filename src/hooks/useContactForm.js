import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export const useContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState(""); // success, error, loading
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validateField = useCallback((name, value) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      let hasChanged = false;

      switch (name) {
        case "name":
          if (!value.trim()) {
            if (!newErrors.name) {
              newErrors.name = "Name is required";
              hasChanged = true;
            }
          } else if (value.trim().length < 2) {
            if (newErrors.name !== "Name must be at least 2 characters long") {
              newErrors.name = "Name must be at least 2 characters long";
              hasChanged = true;
            }
          } else {
            if (newErrors.name) {
              delete newErrors.name;
              hasChanged = true;
            }
          }
          break;

        case "phone":
          if (!value.trim()) {
            if (!newErrors.phone) {
              newErrors.phone = "Phone number is required";
              hasChanged = true;
            }
          } else if (!/^[\+]?[\d\s\-\(\)]{10,}$/.test(value.trim())) {
            if (newErrors.phone !== "Please enter a valid phone number") {
              newErrors.phone = "Please enter a valid phone number";
              hasChanged = true;
            }
          } else {
            if (newErrors.phone) {
              delete newErrors.phone;
              hasChanged = true;
            }
          }
          break;

        case "email":
          if (!value.trim()) {
            if (!newErrors.email) {
              newErrors.email = "Email is required";
              hasChanged = true;
            }
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
            if (newErrors.email !== "Please enter a valid email address") {
              newErrors.email = "Please enter a valid email address";
              hasChanged = true;
            }
          } else {
            if (newErrors.email) {
              delete newErrors.email;
              hasChanged = true;
            }
          }
          break;

        case "message":
          if (!value.trim()) {
            if (!newErrors.message) {
              newErrors.message = "Message is required";
              hasChanged = true;
            }
          } else if (value.trim().length < 10) {
            if (
              newErrors.message !==
              "Message must be at least 10 characters long"
            ) {
              newErrors.message = "Message must be at least 10 characters long";
              hasChanged = true;
            }
          } else {
            if (newErrors.message) {
              delete newErrors.message;
              hasChanged = true;
            }
          }
          break;

        default:
          break;
      }

      // Only return new object if something actually changed
      return hasChanged ? newErrors : prevErrors;
    });

    // Return validation result without relying on state
    const hasError = (() => {
      switch (name) {
        case "name":
          return !value.trim() || value.trim().length < 2;
        case "phone":
          return (
            !value.trim() || !/^[\+]?[\d\s\-\(\)]{10,}$/.test(value.trim())
          );
        case "email":
          return (
            !value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
          );
        case "message":
          return !value.trim() || value.trim().length < 10;
        default:
          return false;
      }
    })();

    return !hasError;
  }, []);

  const validateAllFields = useCallback(() => {
    const fields = ["name", "phone", "email", "message"];
    let isValid = true;

    fields.forEach((field) => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });

    if (!accepted) {
      setErrors((prev) => ({
        ...prev,
        privacy: "You must accept the Privacy Policy",
      }));
      isValid = false;
    } else {
      setErrors((prev) => {
        if (prev.privacy) {
          const newErrors = { ...prev };
          delete newErrors.privacy;
          return newErrors;
        }
        return prev;
      });
    }

    return isValid;
  }, [formData, accepted, validateField]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error when user starts typing - but only if there was an error
      setErrors((prevErrors) => {
        if (prevErrors[name]) {
          validateField(name, value);
        }
        return prevErrors;
      });
    },
    [validateField]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      validateField(name, value);
    },
    [validateField]
  );

  const handleCheckboxChange = useCallback((e) => {
    setAccepted(e.target.checked);

    // Clear privacy error when checkbox is checked
    if (e.target.checked) {
      setErrors((prev) => {
        if (prev.privacy) {
          const newErrors = { ...prev };
          delete newErrors.privacy;
          return newErrors;
        }
        return prev;
      });
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateAllFields()) {
        return;
      }

      setStatus("loading");

      try {
        const res = await fetch("/api/send-form", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formType: "contact",
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: formData.message.trim(),
            phone: formData.phone.trim(),
          }),
        });

        if (res.ok) {
          setStatus("success");
          setFormData({ name: "", phone: "", email: "", message: "" });
          setAccepted(false);
          setErrors({});
          router.push("/contact/success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Contact form error:", error);
        setStatus("error");
      }
    },
    [formData, validateAllFields, router]
  );

  const resetForm = useCallback(() => {
    setFormData({ name: "", phone: "", email: "", message: "" });
    setAccepted(false);
    setErrors({});
    setStatus("");
  }, []);

  return {
    formData,
    accepted,
    status,
    errors,
    handleChange,
    handleBlur,
    handleCheckboxChange,
    handleSubmit,
    resetForm,
  };
};
