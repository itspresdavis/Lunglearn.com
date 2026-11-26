"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { schools } from "@/content/schools";

export function SchoolFilters() {
  const [state, setState] = useState("all");
  const [degree, setDegree] = useState("all");
  const [query, setQuery] = useState("");
  const states = useMemo(() => [...new Set(schools.map((school) => school.state))].sort(), []);
  const shown = schools.filter((school) => {
    if (state !== "all" && school.state !== state) return false;
    if (degree !== "all" && school.degree !== degree) return false;
    const haystack = `${school.institution} ${school.program} ${school.city ?? ""}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });
  return (
    <div>
      <div className="filters">
        <label>
          State{" "}
          <select value={state} onChange={(event) => setState(event.target.value)}>
            <option value="all">All</option>
            {states.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Degree{" "}
          <select value={degree} onChange={(event) => setDegree(event.target.value)}>
            <option value="all">All</option>
            <option value="associate">Associate</option>
            <option value="bachelor">Bachelor</option>
          </select>
        </label>
        <label>
          Accreditation{" "}
          <select defaultValue="unverified" aria-label="Accreditation filter">
            <option value="unverified">Not copied from CoARC</option>
          </select>
        </label>
        <label>
          Institution{" "}
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>Institution</th>
            <th>State</th>
            <th>Degree</th>
            <th>Tuition</th>
            <th>Outcomes</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((school) => (
            <tr key={school.slug}>
              <td>
                <Link href={`/schools/${school.slug}`}>{school.institution}</Link>
              </td>
              <td>{school.state}</td>
              <td>{school.degree}</td>
              <td>Not verified</td>
              <td>Not verified</td>
            </tr>
          ))}
        </tbody>
      </table>
      {shown.length === 0 ? <p>No program in this short list matches those filters.</p> : null}
    </div>
  );
}
