import React from "react";
import { TextField, MenuItem } from "@mui/material";

export default function PatientForm({
  name,
  age,
  gender,
  setName,
  setAge,
  setGender,
}) {
  const inputSx = {
    mb: 1.5,
    "& .MuiInputBase-input": {
      color: "#e8eaf0",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "14px",
    },
    // Select native text
    "& .MuiSelect-select": {
      color: gender ? "#e8eaf0" : "#4a5368",
    },
  };

  return (
    <div>
      <TextField
        fullWidth
        label="Full Name"
        placeholder="Your name"
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={inputSx}
      />

      <TextField
        fullWidth
        label="Age"
        type="number"
        placeholder="23"
        margin="normal"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        sx={inputSx}
      />

      <TextField
        fullWidth
        select
        label="Gender"
        margin="normal"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        sx={inputSx}
      >
        <MenuItem value="" disabled>
          Select gender
        </MenuItem>
        <MenuItem value="Male">Male</MenuItem>
        <MenuItem value="Female">Female</MenuItem>
        <MenuItem value="Other">Other</MenuItem>
      </TextField>
    </div>
  );
}
