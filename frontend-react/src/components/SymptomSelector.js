import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Autocomplete, Chip, CircularProgress } from "@mui/material";

export default function SymptomSelector({
  selectedSymptoms,
  setSelectedSymptoms,
}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/symptoms");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setOptions(res.data.map((s) => s.replace(/_/g, " ")));
        }
      } catch (err) {
        console.error("Error fetching symptoms:", err);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSymptoms();
  }, []);

  return (
    <Autocomplete
      multiple
      options={options}
      value={selectedSymptoms}
      loading={loading}
      onChange={(_, newValue) => setSelectedSymptoms(newValue)}
      noOptionsText={loading ? "Loading symptoms…" : "No symptoms found"}
      popupIcon={null}
      /* Override the Paper (dropdown container) */
      componentsProps={{
        paper: {
          sx: {
            background: "#111520",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "12px",
            boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
            mt: 0.5,
          },
        },
      }}
      sx={{
        mt: 1,
        /* Input root */
        "& .MuiOutlinedInput-root": {
          background: "rgba(255,255,255,0.03)",
          borderRadius: "12px",
          color: "#e8eaf0",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
          minHeight: "52px",
          "& fieldset": { borderColor: "rgba(255,255,255,0.06)" },
          "&:hover fieldset": { borderColor: "rgba(255,255,255,0.10)" },
          "&.Mui-focused fieldset": {
            borderColor: "rgba(99,179,237,0.22)",
            borderWidth: "1px",
          },
        },
        /* Label */
        "& .MuiInputLabel-root": {
          color: "#4a5368",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13.5px",
        },
        "& .MuiInputLabel-root.Mui-focused": { color: "#63b3ed" },
        /* Input text */
        "& input": {
          color: "#e8eaf0",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
        },
        "& input::placeholder": { color: "#4a5368", opacity: 1 },
        /* Dropdown icon */
        "& .MuiSvgIcon-root": { color: "#4a5368" },
        /* Listbox options */
        "& .MuiAutocomplete-listbox": {
          background: "#111520",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13.5px",
          color: "#8892a4",
        },
        "& .MuiAutocomplete-option": {
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13.5px",
          "&:hover": {
            background: "rgba(255,255,255,0.05)",
            color: "#e8eaf0",
          },
          '&[aria-selected="true"]': {
            background: "rgba(99,179,237,0.08)",
            color: "#63b3ed",
          },
        },
        /* No options text */
        "& .MuiAutocomplete-noOptions": {
          color: "#4a5368",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13px",
        },
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={index}
            label={option}
            {...getTagProps({ index })}
            sx={{
              background: "rgba(99,179,237,0.10)",
              border: "1px solid rgba(99,179,237,0.22)",
              color: "#63b3ed",
              borderRadius: "8px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12.5px",
              fontWeight: 500,
              height: "26px",
              "& .MuiChip-deleteIcon": {
                color: "rgba(99,179,237,0.45)",
                "&:hover": { color: "#63b3ed" },
              },
            }}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Symptoms"
          placeholder={
            selectedSymptoms.length === 0 ? "Search and select symptoms…" : ""
          }
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress
                    size={16}
                    sx={{ color: "#4a5368", mr: 1 }}
                  />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
