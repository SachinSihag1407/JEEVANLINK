import React from 'react'

import { useState, useEffect } from "react";

// Minimal useAuth hook placeholder. Replace with real auth/context later.
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // placeholder: check persisted auth here
    setLoading(false);
  }, []);

  return { user, loading };
};

export default useAuth;