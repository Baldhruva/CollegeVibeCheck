"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { validateUsername } from "@/lib/utils/validators";
import { DBCollege } from "@/types/college";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const supabase = createClient();

  const [username, setUsername] = useState("");
  const [colleges, setColleges] = useState<DBCollege[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<DBCollege[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState<DBCollege | null>(null);
  
  const [isCollegesLoading, setIsCollegesLoading] = useState(true);
  const [isSubmitting, startSubmittingTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch all colleges on load
  useEffect(() => {
    async function loadColleges() {
      try {
        const { data, error } = await supabase
          .from("colleges")
          .select("*")
          .order("name", { ascending: true });

        if (error) {
          throw error;
        }
        setColleges(data as DBCollege[]);
      } catch (err: any) {
        console.error("Failed to load colleges:", err.message);
        setErrorMessage("Could not load Mumbai colleges. Please refresh the page.");
      } finally {
        setIsCollegesLoading(false);
      }
    }

    loadColleges();
  }, [supabase]);

  // Filter colleges based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredColleges(colleges);
    } else {
      const filtered = colleges.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredColleges(filtered);
    }
  }, [searchQuery, colleges]);

  // Validate username when it changes
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    if (value.trim()) {
      const validation = validateUsername(value);
      if (!validation.isValid) {
        setUsernameError(validation.error || "Invalid username format.");
      } else {
        setUsernameError(null);
      }
    } else {
      setUsernameError(null);
    }
  };

  const handleSelectCollege = (college: DBCollege) => {
    setSelectedCollege(college);
    setSearchQuery(college.name);
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!user) {
      setErrorMessage("You must be logged in to complete onboarding.");
      return;
    }

    // 1. Validate Username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      setErrorMessage(usernameValidation.error || "Please fix the username errors.");
      return;
    }

    // 2. Validate College
    if (!selectedCollege) {
      setErrorMessage("Please select your college from the list.");
      return;
    }

    startSubmittingTransition(async () => {
      try {
        // 3. Check username uniqueness
        const { data: existingUser, error: checkError } = await supabase
          .from("users")
          .select("username")
          .eq("username", username.trim())
          .maybeSingle();

        if (checkError) {
          throw checkError;
        }

        if (existingUser) {
          setErrorMessage("This username is already taken. Please choose another one.");
          return;
        }

        // 4. Create Student Profile
        const { error: insertError } = await supabase
          .from("users")
          .insert({
            id: user.id,
            username: username.trim(),
            role: "student",
            college_id: selectedCollege.id
          });

        if (insertError) {
          throw insertError;
        }

        // 5. Update Auth Context and Redirect
        await refreshProfile();
        router.push("/dashboard");
      } catch (err: any) {
        console.error("Onboarding submission failed:", err.message);
        setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <div style={{ maxWidth: "480px", margin: "40px auto", padding: "20px" }}>
      <h2>Complete Your Student Profile</h2>
      <p>Set up your username and associate your profile with your college.</p>

      {errorMessage && (
        <div style={{ color: "red", padding: "10px", border: "1px solid red", marginBottom: "15px" }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Username field */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="username" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="e.g., student_mumbai"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            required
            disabled={isSubmitting}
          />
          {usernameError && <p style={{ color: "red", fontSize: "0.85rem", marginTop: "4px" }}>{usernameError}</p>}
        </div>

        {/* College search/selection autocomplete */}
        <div style={{ marginBottom: "20px", position: "relative" }}>
          <label htmlFor="college-search" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Select Your College
          </label>
          <input
            id="college-search"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedCollege(null); // Reset selection when searching
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={isCollegesLoading ? "Loading colleges..." : "Type to search your college..."}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            required
            disabled={isCollegesLoading || isSubmitting}
            autoComplete="off"
          />

          {showDropdown && filteredColleges.length > 0 && (
            <ul
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "white",
                border: "1px solid #ccc",
                margin: 0,
                padding: 0,
                listStyleType: "none",
                maxHeight: "200px",
                overflowY: "auto",
                zIndex: 10,
              }}
            >
              {filteredColleges.map((c) => (
                <li
                  key={c.id}
                  onClick={() => handleSelectCollege(c)}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {c.name}
                </li>
              ))}
            </ul>
          )}

          {showDropdown && filteredColleges.length === 0 && searchQuery && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "white",
                border: "1px solid #ccc",
                padding: "8px",
                color: "#666",
                zIndex: 10,
              }}
            >
              No colleges found matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || !!usernameError || !selectedCollege}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#22c55e",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {isSubmitting ? "Completing Profile..." : "Submit & Continue"}
        </button>
      </form>
    </div>
  );
}
