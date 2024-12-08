import { useEffect, useState } from "react";
import axios from "axios";

export const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

export const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const res = await axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`);
        setCountry(res);
      } catch (error) {
        console.error("Error fetching country data:", error);
        setCountry(null);
      }
    };

    if (name) fetchCountry();
  }, [name]);

  return {
    data: {
      name: country?.data.name.common,
      capital: country?.data.capital,
      population: country?.data.population,
      flag: country?.data.flags.png,
    },
    found: country?.status === 200,
  };
};
