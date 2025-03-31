const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/search", async (req, res) => {
  const { query, page = 1, limit = 20 } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Додаємо випадкові затримки і User-Agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    await page.goto(
      `https://rozetka.com.ua/ua/search/?text=${encodeURIComponent(query)}`,
      {
        waitUntil: "networkidle2",
        timeout: 30000,
      }
    );

    // Чекаємо на появу товарів
    try {
      await page.waitForSelector(".goods-tile", { timeout: 15000 });
    } catch (e) {
      await browser.close();
      return res.json({ products: [] }); // Повертаємо пустий масив, якщо товарів немає
    }

    const products = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll(".goods-tile"));
      return items.map((item) => ({
        title:
          item.querySelector(".goods-tile__title")?.textContent?.trim() ||
          "Немає назви",
        price:
          item.querySelector(".goods-tile__price-value")?.textContent?.trim() ||
          "Ціна не вказана",
        link: item.querySelector(".goods-tile__heading a")?.href || "#",
        image: item.querySelector(".goods-tile__picture img")?.src || "",
      }));
    });

    await browser.close();
    res.json({ products });
  } catch (error) {
    console.error("Помилка парсингу:", error);
    res.status(500).json({ error: "Помилка при пошуку товарів" });
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
