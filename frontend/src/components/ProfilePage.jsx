import React, { useMemo, useState } from "react";
import { deleteMyProfile, updateMyProfile } from "../services/userService";
import { clearAuthSession, saveAuthSession } from "../services/authStorage";
import "./ProfilePage.css";

function ProfilePage({ currentUser, onBack, onUserUpdated, onDeleted }) {
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [tagline, setTagline] = useState(currentUser?.tagline || "");
  const [location, setLocation] = useState(currentUser?.location || "");
  const [website, setWebsite] = useState(currentUser?.website || "");
  const [interestsInput, setInterestsInput] = useState(
    Array.isArray(currentUser?.interests) ? currentUser.interests.join(", ") : ""
  );
  const [loading, setLoading] = useState(false);

  const roleLabel = useMemo(() => {
    if (currentUser?.role === "organizer") {
      return "Organizer Profile";
    }

    if (currentUser?.role === "attendee") {
      return "Attendee Profile";
    }

    return "Admin Profile";
  }, [currentUser?.role]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const interests = interestsInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const response = await updateMyProfile({
        name,
        email,
        bio,
        tagline,
        location,
        website,
        interests,
      });

      const updatedUser = response?.data?.data;
      saveAuthSession(updatedUser);
      onUserUpdated(updatedUser);
      alert("Profile updated successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    }

    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Delete your account permanently? This cannot be undone.")) {
      return;
    }

    try {
      await deleteMyProfile();
      clearAuthSession();
      onDeleted();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <main className="main-content profile-page-wrap">
      <section className="content-section profile-page-shell">
        <div className="section-heading-row">
          <div>
            <h2 className="section-title">Edit Profile</h2>
            <p className="section-subtitle">{roleLabel}</p>
          </div>
          <button className="back-btn profile-back-btn" onClick={onBack}>Back</button>
        </div>

        <form className="profile-form" onSubmit={handleSave}>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />

          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>Tagline</label>
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder={currentUser?.role === "organizer" ? "What do you organize?" : "One line about you"}
          />

          <label>Bio</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people a bit about yourself"
          />

          <label>Interests (comma separated)</label>
          <input
            value={interestsInput}
            onChange={(e) => setInterestsInput(e.target.value)}
            placeholder={currentUser?.role === "organizer" ? "music, startup, networking" : "travel, concerts, workshops"}
          />

          <label>Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />

          <label>Website</label>
          <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://your-site.com" />

          <div className="profile-form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </button>
            <button type="button" className="delete-btn" onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default ProfilePage;
