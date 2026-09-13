import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Ensure persistent uploads directories exist
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const videoUploadsDir = path.join(uploadsDir, "videos");
  if (!fs.existsSync(videoUploadsDir)) {
    fs.mkdirSync(videoUploadsDir, { recursive: true });
  }

  // Serve uploads statically with HTTP Range request support and CORS for reliable video playback
  app.use(
    "/uploads",
    express.static(uploadsDir, {
      acceptRanges: true,
      maxAge: "30d",
      setHeaders: (res, filePath) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Accept-Ranges", "bytes");
        const lower = filePath.toLowerCase();
        if (lower.endsWith(".mp4")) {
          res.setHeader("Content-Type", "video/mp4");
        } else if (lower.endsWith(".webm")) {
          res.setHeader("Content-Type", "video/webm");
        } else if (lower.endsWith(".mov")) {
          res.setHeader("Content-Type", "video/quicktime");
        }
      },
    })
  );

  // Multer disk storage for permanent product video files
  const videoStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      if (!fs.existsSync(videoUploadsDir)) {
        fs.mkdirSync(videoUploadsDir, { recursive: true });
      }
      cb(null, videoUploadsDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || ".mp4";
      const cleanExt = [".mp4", ".mov", ".webm"].includes(ext) ? ext : ".mp4";
      const uniqueName = `video_${Date.now()}_${Math.random().toString(36).substring(2, 9)}${cleanExt}`;
      cb(null, uniqueName);
    },
  });

  const uploadVideo = multer({
    storage: videoStorage,
    limits: {
      fileSize: 100 * 1024 * 1024, // 100MB limit
    },
    fileFilter: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const mime = (file.mimetype || "").toLowerCase();
      const allowedExts = [".mp4", ".mov", ".webm"];
      const isAllowed =
        allowedExts.includes(ext) ||
        mime.includes("mp4") ||
        mime.includes("quicktime") ||
        mime.includes("webm") ||
        mime.startsWith("video/");
      if (isAllowed) {
        cb(null, true);
      } else {
        cb(new Error("Yalnız MP4, MOV və ya WEBM formatlı videolar qəbul olunur"));
      }
    },
  });

  // Product Video Upload Endpoint
  app.post(["/api/upload-video", "/api/upload"], (req, res) => {
    uploadVideo.any()(req, res, (err) => {
      res.setHeader("Content-Type", "application/json");
      if (err) {
        console.error("Video upload error:", err);
        return res.status(400).json({
          error: err.message || "Video yüklənərkən xəta baş verdi",
        });
      }

      const file =
        (req as any).file ||
        ((req as any).files && Array.isArray((req as any).files) && (req as any).files[0]);

      if (!file) {
        return res.status(400).json({
          error: "Heç bir video faylı göndərilməyib",
        });
      }

      const relativeUrl = `/uploads/videos/${file.filename}`;
      console.log(`Video uploaded successfully: ${relativeUrl} (${file.size} bytes)`);

      return res.json({
        success: true,
        url: relativeUrl,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype || "video/mp4",
      });
    });
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      model: "gemini-3.8-flash",
      hasKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Gemini 3.8 Flash AI Assistant Endpoint
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, history = [], context = {} } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: "GEMINI_API_KEY is not configured in the environment",
          fallbackNeeded: true,
        });
      }

      const ai = getGenAI();

      const { products = [], coupons = [], orders = [], userName = "Müştəri" } = context;

      const productCatalogSnippet = products
        .slice(0, 25)
        .map(
          (p: any) =>
            `ID: ${p.id} | Ad: ${p.title} | Qiymət: ${p.price} AZN ${
              p.oldPrice && p.oldPrice > p.price ? `(Köhnə: ${p.oldPrice} AZN)` : ""
            } | Kateqoriya: ${p.category} | Reytinq: ${p.rating} | Teqlər: ${(p.tags || []).join(", ")}`
        )
        .join("\n");

      const couponSnippet = coupons
        .map((c: any) => `Kupon Kodu: ${c.code} (${c.discountValue}% endirim)`)
        .join(", ");

      const systemInstruction = `Sən "MMZ ONLINE" (Azərbaycanın ən qabaqcıl 3D premium e-ticarət marketplace platforması) üçün Google-un ən son "Gemini 3.8 Flash" modeli tərəfindən idarə olunan Ağıllı Alış-Veriş Köməkçisisən.
Müştərilərlə hər zaman nəzakətli, peşəkar, səmimi və səlis Azərbaycan dilində ünsiyyət qur.

Mağaza və Xidmət Qaydaları:
1. Pulsuz Çatdırılma: 35 AZN və daha yüksək bütün sifarişlər üçün çatdırılma Azərbaycanın hər bir bölgəsinə tamamilə PULSUZDUR. Bakı daxilində ekspress çatdırılma 2 saat, standart çatdırılma 1-2 gün, regionlar üzrə isə 2-3 gün ərzində ünvana çatdırılır.
2. Ödəniş Üsulları: Qapıda nağd və ya POS-terminal kartla ödəniş, BirKart və TamKart ilə 2, 3, 6, 12 aylıq 0% faizsiz taksit, 3D Secure onlayn bank kartları, MMZ Wallet və keşbek bonusları.
3. 100% Orijinallıq və Zəmanət: Bütün məhsullar rəsmi sertifikatlı və zəmanətlidir. Qaytarılma və ya dəyişdirilmə xidməti mövcuddur.
4. Canlı Dəstək: Əgər istifadəçi canlı insanla, operatorla və ya adminlə danışmaq istəsə, dərhal ona "Canlı Dəstəyə Yaz" seçimini təklif et.
5. Endirim Kuponları: Hazırkı aktiv kupon: ${couponSnippet || "MMZ2026 (20% endirim)"}.

Hazırkı Məhsul Kataloqu:
${productCatalogSnippet}

Müştərinin adı: ${userName}.

Tələb:
İstifadəçiyə Azərbaycan dilində aydın, oxunaqlı və faydalı cavab ver. Əgər sorğuya uyğun məhsullar varsa, onların ID-lərini "suggestedProductIds" siyahısına əlavə et. Həmçinin 2-4 ədəd uyğun sürətli klik düyməsi (suggestedActions) təqdim et.`;

      // Build conversation contents
      const contentsPayload: any[] = [];
      if (Array.isArray(history) && history.length > 0) {
        const recent = history.slice(-6);
        for (const h of recent) {
          if (h.sender === "user" || h.role === "user") {
            contentsPayload.push({ role: "user", parts: [{ text: h.text }] });
          } else if (h.sender === "bot" || h.role === "model") {
            contentsPayload.push({ role: "model", parts: [{ text: h.text }] });
          }
        }
      }
      contentsPayload.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: contentsPayload,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: {
                type: Type.STRING,
                description: "Azərbaycan dilində müştəriyə ətraflı və faydalı cavab",
              },
              suggestedProductIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Müştərinin sorğusuna uyğun gələn məhsulların ID siyahısı",
              },
              suggestedActions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: {
                      type: Type.STRING,
                      description: "Düymə yazısı, məs: 🟢 Canlı Dəstəyə Yaz, ⚡ Flaş Satışlar",
                    },
                    action: {
                      type: Type.STRING,
                      description:
                        "open_live_support, go_to_flash_sales, go_to_orders, go_to_cart, go_to_home, ask_delivery, ask_payment, search_product",
                    },
                    payload: {
                      type: Type.STRING,
                      description: "Əlavə parametr və ya axtarış sözü",
                    },
                  },
                  required: ["label", "action"],
                },
              },
            },
            required: ["text"],
          },
        },
      });

      const rawText = response.text || "{}";
      let parsedData: any = {};
      try {
        parsedData = JSON.parse(rawText);
      } catch {
        parsedData = { text: rawText };
      }

      let matchedProducts: any[] = [];
      if (Array.isArray(parsedData.suggestedProductIds) && Array.isArray(products)) {
        matchedProducts = products.filter((p: any) =>
          parsedData.suggestedProductIds.includes(p.id)
        );
      }

      return res.json({
        text: parsedData.text || "Sizə necə kömək edə bilərəm?",
        suggestedActions: parsedData.suggestedActions || [
          { label: "🟢 Canlı Dəstəyə Yaz", action: "open_live_support" },
          { label: "⚡ Flaş Endirimlər", action: "go_to_flash_sales" },
        ],
        productSuggestions: matchedProducts,
        model: "gemini-3.8-flash",
      });
    } catch (error: any) {
      console.error("Gemini 3.8 Flash generation error:", error);
      return res.status(500).json({
        error: error?.message || "Xəta baş verdi",
        fallbackNeeded: true,
      });
    }
  });

  // Vite middleware in dev, static dist in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} with Gemini 3.8 Flash`);
  });
}

startServer();
