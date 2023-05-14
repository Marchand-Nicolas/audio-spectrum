const config = {
  apiURL:
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:8081"
      : "https://concours-culte-du-code.nico-best-pc-ever.ovh",
};

export default config;
