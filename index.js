import express from "express";
import Joi from "joi";

const app = express();
app.use(express.json());

 let profiles = [];

// JOI VALIDATION SCHEMA
    
const profileSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  age: Joi.number().min(10).required()
});

// CREATE PROFILE
   
app.post("/profile", (req, res) => {
  const { error } = profileSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const profileExists = profiles.find(
    p => p.email === req.body.email
  );

  if (profileExists) {
    return res.status(409).json({ message: "Profile already exists" });
  }

  const newProfile = {
    id: profiles.length + 1,
    ...req.body
  };

  profiles.push(newProfile);
  res.status(201).json({
    message: "Profile created successfully",
    profile: newProfile
  });
});

//  GET ALL PROFILES
   
app.get("/profile", (req, res) => {
  res.json(profiles);
});

// UPDATE PROFILE
    
app.put("/profile/:id", (req, res) => {
  const { error } = profileSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const profileIndex = profiles.findIndex(
    p => p.id === Number(req.params.id)
  );

  if (profileIndex === -1) {
    return res.status(404).json({ message: "Profile not found" });
  }

  profiles[profileIndex] = {
    id: profiles[profileIndex].id,
    ...req.body
  };

  res.json({
    message: "Profile updated successfully",
    profile: profiles[profileIndex]
  });
});

// DELETE PROFILE
  
app.delete("/profile/:id", (req, res) => {
  const profileIndex = profiles.findIndex(
    p => p.id === Number(req.params.id)
  );

  if (profileIndex === -1) {
    return res.status(404).json({ message: "Profile not found" });
  }

  profiles.splice(profileIndex, 1);
  res.json({ message: "Profile deleted successfully" });
});

// SERVER
   
app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
