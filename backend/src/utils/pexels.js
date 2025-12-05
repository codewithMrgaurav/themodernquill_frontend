const https = require("https");

const PEXELS_API_KEY = process.env.PEXEL_API_KEY || process.env.PEXELS_API_KEY || "dmNFVlqIUbDDzVqG0AdFoB4OanabYKSauyPzL7fS9uwkcmJydHhe6m87i";
const PEXELS_API_URL = "https://api.pexels.com/v1";

async function searchImages(query, options = {}) {
  return new Promise((resolve, reject) => {
    if (!PEXELS_API_KEY) {
      return reject(new Error("Pexels API key is not configured"));
    }

    const { perPage = 20, page = 1, orientation = "all", size = "all", color = "all" } = options;

    const queryParams = new URLSearchParams({
      query: query.trim(),
      per_page: perPage.toString(),
      page: page.toString(),
    });

    if (orientation !== "all") {
      queryParams.append("orientation", orientation);
    }
    if (size !== "all") {
      queryParams.append("size", size);
    }
    if (color !== "all") {
      queryParams.append("color", color);
    }

    const url = `${PEXELS_API_URL}/search?${queryParams.toString()}`;

    const options_req = {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    };

    https
      .get(url, options_req, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            if (res.statusCode === 200) {
              const result = JSON.parse(data);
              resolve(result);
            } else {
              const error = JSON.parse(data);
              reject(new Error(error.error || `Pexels API error: ${res.statusCode}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse Pexels API response: ${error.message}`));
          }
        });
      })
      .on("error", (error) => {
        reject(new Error(`Pexels API request failed: ${error.message}`));
      });
  });
}

async function getImageById(id) {
  return new Promise((resolve, reject) => {
    if (!PEXELS_API_KEY) {
      return reject(new Error("Pexels API key is not configured"));
    }

    const url = `${PEXELS_API_URL}/photos/${id}`;

    const options_req = {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    };

    https
      .get(url, options_req, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            if (res.statusCode === 200) {
              const result = JSON.parse(data);
              resolve(result);
            } else {
              const error = JSON.parse(data);
              reject(new Error(error.error || `Pexels API error: ${res.statusCode}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse Pexels API response: ${error.message}`));
          }
        });
      })
      .on("error", (error) => {
        reject(new Error(`Pexels API request failed: ${error.message}`));
      });
  });
}

module.exports = {
  searchImages,
  getImageById,
};

