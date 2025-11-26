"use client";
import React, { useState, useEffect } from "react";

export default function Home() {
  // state to manage form inputs
  const [form, setForm] = useState({
    antispam: "",
    name: "",
    email: "",
    company: "",
    satisfaction: "3",
    message: "",
  });

  // state to track feedback message tyoe and submitted
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbcakType, setFeedbackType] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [data, setData] = useState(null); // state to hold resolved value
  const [loading, setLoading] = useState(true); // state to track loading
  const [error, setError] = useState<Error | null>(null); // state to track errors

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://swapi.dev/api/people/");
        const json = await res.json();
        setData(json); // update state when Promise resolves
        // console.log(json);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // function to handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFeedbackMessage("");
    setFeedbackType("");

    if (submitted) return;

    // validate anitspam field
    if (form.antispam.toLowerCase().trim() !== "oslo") {
      setFeedbackMessage("Antispam answer is incorrect.");
      setFeedbackType("error");
      return;
    }

    // validate other required fields
    if (!form.name || !form.email || !form.satisfaction) {
      setFeedbackMessage("Please fill in all required fields.");
      setFeedbackType("error");
      return;
    }

    // send the form to backend API
    try {
      const reponse = await fetch("/api/api-submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await reponse.json();

      if (reponse.ok) {
        setFeedbackMessage("✅ Form submitted successfully! ");
        setFeedbackType("success");
        setSubmitted(true);
      } else {
        // console.log(`page.tsx result error: `, result);
        setFeedbackMessage(
          result.error || "❌ An error occurred while submitting the form."
        );
        setFeedbackType("error");
      }
    } catch (error) {
      setFeedbackMessage("An error occurred while submitting the form.");
      setFeedbackType("error");
      console.error("Form submission error:", error);
    }
  };
  return (
    <>
      <h1>User Feedback Form</h1>

      {/* show feedback message if exists */}
      {feedbackMessage && <div className={feedbcakType}>{feedbackMessage}</div>}

      {/* show form */}
      {submitted ? (
        <p>Thank you for your feedback</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <p>
            <label>what is the capital of norway?</label>
            <input
              type="text"
              name="antispam"
              required
              style={{ width: "99%" }}
              autoFocus
              onChange={handleChange}
              // value={form.antispam}
            />
          </p>
          <p>
            <label>Name</label>
            <input
              type="text"
              name="name"
              required
              style={{ width: "99%" }}
              onChange={handleChange}
              // value={form.name}
            />
          </p>
          <p>
            <label>Email</label>
            <input
              type="text"
              name="email"
              required
              style={{ width: "99%" }}
              onChange={handleChange}
              // value={form.email}
            />
          </p>
          <p>
            <label>Company</label>
            <input
              type="text"
              name="company"
              style={{ width: "99%" }}
              onChange={handleChange}
              // value={form.company}
            />
          </p>
          <p>
            <label>Satisfaction</label>
            <select
              name="satisfaction"
              required
              style={{ width: "99%" }}
              onChange={handleChange}
              // value={form.satisfaction}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </p>
          <p>
            <label>Message</label>
            <textarea
              name="message"
              style={{ width: "99%" }}
              rows={6}
              onChange={handleChange}
              // value={form.message}
            />
          </p>
          <p>
            <button type="submit">Send</button>
          </p>
        </form>
      )}
      <div>
        <h2>Data from differnet fetching</h2>
        {/* <ol>
          {!data
            ? "Loading..."
            : data.results.map((person: any) => (
                <li key={person.name}>{person.name}</li>
              ))}
        </ol> */}
      </div>
    </>
  );
}

async function getPeopleAPI() {
  const res = await fetch("https://swapi.dev/api/people/");
  if (!res.ok) {
    console.error("Failed to fetch people data");
  }
  const test = res.json();
  return test;
}
