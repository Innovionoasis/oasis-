require('dotenv').config();
const express = require("express");
const { Client } = require("pg");
const axios = require("axios");
const cors = require("cors"); // ✅ 1. استدعاء CORS
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const app = express();
const PORT = 4000;

// إعداد Firebase Admin
const serviceAccount = require("./config/serviceAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🟢 أول شيء CORS
const corsOptions = {
  origin: "*", 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization"
};
app.use(cors(corsOptions));

// 🟢 بعدها JSON Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// إعداد الاتصال بقاعدة البيانات
const con = new Client({
  host: "localhost",
  user: "postgres",
  password: "Gradpro2025",
  database: "innovation Oasis",
  port: 5432
});

con.connect()
    .then(() => console.log("✅ Connected to PostgreSQL"))
    .catch(err => console.error("❌ Connection error:", err.stack));

// Handle the root route
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Innovation Oasis API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
          }
          h1 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
          }
          h2 {
            color: #3498db;
          }
          code {
            background-color: #f8f8f8;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: monospace;
          }
          .endpoint {
            background-color: #f5f5f5;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #3498db;
            border-radius: 3px;
          }
        </style>
      </head>
      <body>
        <h1>Innovation Oasis API</h1>
        <p>Welcome to the Innovation Oasis API server. Below are the available endpoints:</p>
        
        <h2>Data Endpoints:</h2>
        <div class="endpoint">
          <p><strong>GET /api/:table</strong> - Retrieve all records from a table</p>
          <p>Example: <code>GET /api/users</code></p>
        </div>
        
        <div class="endpoint">
          <p><strong>POST /api/:table</strong> - Create a new record in a table</p>
          <p>Example: <code>POST /api/users</code> with JSON body</p>
        </div>
        
        <div class="endpoint">
          <p><strong>PUT /api/:table/:id</strong> - Update a record by ID</p>
          <p>Example: <code>PUT /api/users/123</code> with JSON body</p>
        </div>
        
        <div class="endpoint">
          <p><strong>DELETE /api/:table/:id</strong> - Delete a record by ID</p>
          <p>Example: <code>DELETE /api/users/123</code></p>
        </div>
        
        <h2>Mentorship Request Endpoints:</h2>
        <div class="endpoint">
          <p><strong>PUT /api/mentorshiprequest/:id/accept</strong> - Accept a mentorship request</p>
        </div>
        
        <div class="endpoint">
          <p><strong>PUT /api/mentorshiprequest/:id/reject</strong> - Reject a mentorship request</p>
        </div>
        
        <div class="endpoint">
          <p><strong>PUT /api/mentorshiprequest/:id/changeState</strong> - Change mentorship request status</p>
        </div>
        
        <h2>Chat Endpoint:</h2>
        <div class="endpoint">
          <p><strong>POST /chat</strong> - Send a message to OpenAI GPT</p>
          <p>Example: <code>POST /chat</code> with JSON body containing a message</p>
        </div>
        
        <p>Server running on port ${PORT}</p>
      </body>
    </html>
  `);
});

// دالة مساعدة لوضع اسم الجدول أو العمود بين علامات اقتباس إذا كان يحتوي على أحرف خاصة
function safeColumnName(name) {
  if (typeof name === 'string' && (name.includes('-') || name.includes(' ') || name.includes('.') || /[A-Z]/.test(name))) {
    return `"${name}"`;
  }
  return name;
}
// استعلام كل البيانات من جدول معين
/*app.get("/api/:table", async (req, res) => {
  
  const tableName = safeColumnName(req.params.table);
  try {
    const result = await con.query(`SELECT * FROM ${tableName}`);
    res.json(result.rows);
  } catch (err) {
    console.error(" Query Error:", err);
    res.status(500).json({ error: ` خطأ في جلب البيانات من ${tableName}` });
  }
  
});
*/
// تسجيل مستخدم جديد في Firebase 
app.post("/api/auth/register", async (req, res) => {
  const { email, password, name, phone } = req.body;
  try {
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
      console.log("المستخدم موجود مسبقًا:", userRecord.uid);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        userRecord = await admin.auth().createUser({
          email,
          password,
          displayName: name,
          phoneNumber: phone || undefined
        });
        console.log("تم إنشاء مستخدم جديد:", userRecord.uid);
      } else {
        throw error;
      }
    }

    return res.status(201).json({
      message: " تم إنشاء المستخدم في Firebase",
      uid: userRecord.uid
    });

  } catch (error) {
    console.error(" خطأ في تسجيل المستخدم:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/fundingoffer", (req, res) => {
  const { innovatorId, moneyOffered, status, ideaId } = req.body;

  const insertQuery = `
    INSERT INTO fundingoffer (innovatorid, moneyoffered, status, ideaid, offerdate)
    VALUES (?, ?, ?, ?, NOW())
  `;

  const values = [innovatorId, moneyOffered, status, ideaId];

  con.query(insertQuery, values, (err, results) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ message: "Server error", error: err });
    }

    res.status(201).json({
      message: "Data inserted successfully",
      data: {
        innovatorId,
        moneyOffered,
        status,
        ideaId,
        fundingid: results.insertId, // Auto-incremented ID from DB
      }
    });
  });
});

app.post("/api/mentorshiprequestsfrominnovators", async (req, res) => {
  try {
    const { mentorid, innovatorid, reason, ideaid, title } = req.body;

    const result = await con.query(
      `INSERT INTO mentorshiprequestsfrominnovators 
        (mentorid, innovatorid, reason, ideaid, title, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'قيد المعالجة', NOW())
       RETURNING *`,
      [mentorid, innovatorid, reason, ideaid, title]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting mentorship request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/fundingrequest", (req, res) => {
  const {
    investorid,
    innovatorid,
    requiredamount,
    reason,
    status,
    ideaid,
    submissiondate
  } = req.body;

  const insertQuery = `
    INSERT INTO fundingrequest 
    (investorid, innovatorid, requiredamount, reason, status, ideaid, submissiondate)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    investorid,
    innovatorid,
    requiredamount,
    reason,
    status,
    ideaid,
    submissiondate
  ];

  con.query(insertQuery, values)
    .then(result => {
      res.status(201).json({
        message: "✅ تم إدخال طلب التمويل بنجاح",
        data: result.rows[0]
      });
    })
    .catch(err => {
      console.error("❌ Insert error:", err);
      res.status(500).json({ message: "Server error", error: err });
    });
});
app.post("/api/fundingoffer", async (req, res) => {
  // Handle data insertion for the 'fundingoffer' table
  const { ideaName, innovator, moneyoffered, status, offerdate } = req.body;

  if (!ideaName || !moneyoffered) {
    return res.status(400).json({ error: "فكرة العرض والمبلغ المقدم مطلوبان" });
  }

  try {
    // Insert into the 'fundingoffer' table
    const result = await con.query(
      `INSERT INTO fundingoffer (ideaName, innovator, moneyoffered, status, offerdate)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [ideaName, innovator, moneyoffered, status, offerdate]
    );

    return res.status(201).json({
      message: "✅ تم إضافة عرض التمويل بنجاح",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("❌ Error inserting funding offer:", error);
    return res.status(500).json({
      error: "خطأ في حفظ عرض التمويل",
      details: error.message
    });
  }
});


app.post("/api/contract", async (req, res) => {
  console.log("🔸 Received POST data:", req.body);

  try {
    const {
      ideaname,
      signeddate,
      expirationdate,
      status,
      terms,
      fundingamount,
      implementationperiod,
      investorname,
      innovatorname,
      innovatorsignature,
    } = req.body;

    const result = await con.query(
      `INSERT INTO contract 
      (ideaname, signeddate, expirationdate, status, terms, fundingamount, implementationperiod, investorname, innovatorname, innovatorsignature)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        ideaname,
        signeddate,
        expirationdate,
        status,
        terms,
        fundingamount,
        implementationperiod,
        investorname,
        innovatorname,
        innovatorsignature
      ]
    );

    res.status(201).json({ message: "Contract saved", contract: result.rows[0] });

  } catch (error) {
    console.error("❌ Error saving contract:", error);
    res.status(500).json({ error: "Server error saving contract" });
  }
}); 
app.get("/custom/acceptedIdeasWithDetails", async (req, res) => { 
  try {
    const result = await con.query(`
      SELECT
          idea.ideaid,
          idea.title,
          idea.description,
          idea.category,
          idea.problem,
          idea.attachments,
          innovator.f_name,
          innovator.l_name,
          CONCAT(innovator.f_name, ' ', innovator.l_name) AS innovator_name,
          innovator.innovatorid,
          review.rating,  
          review.created_at 
      FROM review
      JOIN idea ON review.ideaid = idea.ideaid
      LEFT JOIN innovator ON idea.innovatorid = innovator.innovatorid
      WHERE TRIM(review.status) = 'تم التقييم';
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching accepted ideas with details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/custom/reviewStats", async (req, res) => {
  try {
    const result = await con.query(`
      SELECT status, COUNT(*) as count
      FROM review
      GROUP BY status
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching review stats:", err);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

app.put("/api/review/:id", async (req, res) => {
  const reviewid = req.params.id;
  const { status, review_comment, is_applicable, rating } = req.body;

  try {
    const result = await con.query(
      `UPDATE review
       SET status = $1, review_comment = $2, is_applicable = $3, rating = $4
       WHERE reviewid = $5`,
      [status || 'تم التقييم', review_comment, is_applicable, rating, reviewid]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "❌ لم يتم العثور على المراجعة المطلوبة." });
    }

    return res.json({ message: "✅ تم تحديث المراجعة بنجاح" });

  } catch (err) {
    console.error("❌ Update Error:", err);
    return res.status(500).json({ error: "❌ خطأ في تحديث المراجعة." });
  }
});

  app.get("/custom/reviewIdeaInnovator", async (req, res) => {
  try {
    const debugCheck = await con.query(`
      SELECT * FROM review WHERE status = 'تحتاج لتقييم'
    `);
    console.log("🔍 Raw review needing تقييم:", debugCheck.rows); // 👈 راح يظهر في التيرمنال

    const result = await con.query(`
      SELECT 
        review.reviewid,
        review.status,
        idea.ideaid,
        idea.title,
        idea.description,
        idea.category,
        idea.attachments
      FROM review
      JOIN idea ON review.ideaid = idea.ideaid
      WHERE review.status = 'تحتاج لتقييم'
    `);
    

    console.log("✅ ideas needing review:", result.rows); 

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching joined data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/custom/acceptedIdeas", async (req, res) => {
  try {
    const result = await con.query(`
      SELECT 
        review.reviewid,
        review.status,
        idea.ideaid,
        idea.title,
        idea.description,
        idea.category,
        idea.attachments
      FROM review
      JOIN idea ON review.ideaid = idea.ideaid
      WHERE review.status = 'تحتاج لتقييم'
    `);

    console.log("✅ accepted ideas:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching accepted ideas:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/api/review", async (req, res) => {
  try {
    const {
      ideaid,
      status,
      review_comment,
      is_applicable,
      rating
    } = req.body;
    
    if (!ideaid) {
      return res.status(400).json({ error: "ideaid مطلوب." });
    }
    
    const finalStatus = status || "مقبول";
    const finalComment = review_comment || "";
    const finalApplicable = typeof is_applicable === "boolean" ? is_applicable : true;
    const finalRating = Number.isInteger(rating) ? rating : 5;
    

    const result = await con.query(
      `INSERT INTO review (ideaid, status, review_comment, is_applicable, rating)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [ideaid, finalStatus, finalComment, finalApplicable, finalRating]
    );
    

    res.status(201).json({
      message: "✅ تم حفظ التقييم بنجاح",
      data: result.rows[0]
    });
  } catch (err) {
    console.error("❌ خطأ أثناء حفظ التقييم:", err);
    res.status(500).json({ error: "خطأ في حفظ التقييم", details: err.message });
  }
});
app.get('/api/mentorrequested', (req, res) => {
  const query = `SELECT * FROM mentorship_request_view`;

  con.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching mentor requested data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});


app.post("/api/:role", async (req, res) => {
  const { role } = req.params;

  // ✅ Special handling for idea submission
  if (role === "idea") {
    try {
      console.log("Received idea data:", req.body);
      
      const { 
        title, 
        description, 
        submissiondate, 
        category, 
        problem, 
        shared, 
        attachments 
      } = req.body;

      if (!title || !description) {
        return res.status(400).json({ 
          error: "عنوان الفكرة والوصف مطلوبان",
          received: req.body
        });
      }

      let attachmentsJSON = "[]";
      if (attachments) {
        try {
          if (typeof attachments === 'string') {
            JSON.parse(attachments);
            attachmentsJSON = attachments;
          } else if (Array.isArray(attachments)) {
            attachmentsJSON = JSON.stringify(attachments);
          } else if (typeof attachments === 'object') {
            attachmentsJSON = JSON.stringify([attachments]);
          }
        } catch (e) {
          console.error("Error processing attachments:", e);
        }
      }

      const result = await con.query(
        `INSERT INTO idea 
        (title, description, submissiondate, category, problem, shared, attachments)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
          title, 
          description, 
          submissiondate || new Date().toISOString(), 
          category || "عام", 
          problem || "", 
          shared || "لا", 
          attachmentsJSON
        ]
      );

      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("❌ Error inserting idea:", error);
      return res.status(500).json({ 
        error: "خطأ في حفظ البيانات", 
        details: error.message 
      });
    }
  }
  const validRoles = ["innovator", "mentor", "reviewer", "investor","admin"];
  // ✅ Handling user roles only
  if (!validRoles.includes(role.toLowerCase())) {
    console.error(`❌ محاولة إضافة مستخدم لدور غير صالح: ${role}`);
    return res.status(400).json({ 
      error: "Invalid role specified.",
      message: "الدور غير صالح. الأدوار المسموح بها هي: مبتكر، مرشد، مراجع، مستثمر" 
    });
  }

  // ✅ Handle user registration
  const {
    f_name, l_name, email,
    password, phone, requestedrole,
    gender, age
  } = req.body;

  try {
    const query = `
      INSERT INTO ${role.toLowerCase()}
      (f_name, l_name, email, password, phone, requestedrole, gender, age)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      f_name,
      l_name,
      email,
      password,
      phone || null,
      requestedrole || null,
      gender || null,
      age || null
    ];

    const result = await con.query(query, values);

    res.status(201).json({
      message: "✅ تم إضافة المستخدم إلى جدول " + role,
      data: result.rows[0]
    });

  } catch (err) {
    console.error("❌ خطأ في إدخال المستخدم في الجدول:", err);
    res.status(500).json({ 
      error: "Database insert error.", 
      details: err.message 
    });
  }
});


// جلب جميع البيانات من جدول معين
app.get("/api/:table", async (req, res) => {
    const tableName = req.params.table;
    try {
        const result = await con.query(`SELECT * FROM ${tableName}`);
        res.json(result.rows);
    } catch (err) {
        console.error("❌ Query Error:", err);
        res.status(500).json({ error: `❌ خطأ في جلب البيانات من ${tableName}` });
    }
});
// server.js أو في ملف الراوتات
app.get("/api/approved-ideas", async (req, res) => {
  try {
    const result = await con.query(`
      SELECT
          idea.ideaid,
          idea.title,
          idea.description,
          idea.submissiondate,
          idea.category,
          idea.problem,
          idea.shared,
          idea.attachments,
          innovator.innovatorid,
          innovator.f_name,
          innovator.l_name,
          CONCAT(innovator.f_name, ' ', innovator.l_name) AS innovator_name,
          review.status AS review_status,
          review.rating
      FROM idea
      LEFT JOIN innovator ON idea.innovatorid = innovator.innovatorid
      JOIN review ON idea.ideaid = review.ideaid
      WHERE TRIM(review.status) = 'تم التقييم'
      ORDER BY idea.submissiondate DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching approved ideas:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/debug/idea-schema", async (req, res) => {
  try {
    const result = await con.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'idea'
      ORDER BY ordinal_position
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching schema:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// إدخال بيانات جديدة في جدول معين
// في server.js
app.post("/api/idea", async (req, res) => {
  try {
    console.log("Received idea data:", req.body);
    
    const { 
      title, 
      description, 
      submissiondate, 
      category, 
      problem, 
      shared, 
      attachments 
    } = req.body;

    // التحقق من البيانات الضرورية
    if (!title || !description) {
      return res.status(400).json({ 
        error: "عنوان الفكرة والوصف مطلوبان",
        received: req.body
      });
    }

    // معالجة المرفقات
    let attachmentsJSON = "[]";
    if (attachments) {
      try {
        if (typeof attachments === 'string') {
          // التحقق من أنها JSON صالح
          JSON.parse(attachments);
          attachmentsJSON = attachments;
        } else if (Array.isArray(attachments)) {
          attachmentsJSON = JSON.stringify(attachments);
        } else if (typeof attachments === 'object') {
          attachmentsJSON = JSON.stringify([attachments]);
        }
      } catch (e) {
        console.error("Error processing attachments:", e);
      }
    }

    // إدراج الفكرة في قاعدة البيانات
    const result = await con.query(
      `INSERT INTO idea 
      (title, description, submissiondate, category, problem, shared, attachments)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        title, 
        description, 
        submissiondate || new Date().toISOString(), 
        category || "عام", 
        problem || "", 
        shared || "لا", 
        attachmentsJSON
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error inserting idea:", error);
    res.status(500).json({ 
      error: "خطأ في حفظ البيانات", 
      details: error.message 
    });
  }
});
app.get("/api/fundingoffer", (req, res) => {
  console.log("📥 Fetching funding offers with idea and innovator details");

  const query = `
    SELECT 
      -- بيانات من جدول fundingoffer
      f.fundingid,
      f.moneyoffered,
      f.offerdate,
      f.status AS funding_status,
      
      -- بيانات من جدول idea
      i.ideaid,
      i.title,
      i.description,
      i.category,
      i.problem,
      i.attachments,
      
      -- بيانات من جدول innovator
      inv.innovatorid,
      inv.f_name,
      inv.l_name,
      CONCAT(inv.f_name, ' ', inv.l_name) AS innovator_name,
      
      -- بيانات من جدول review
      r.status AS review_status,
      r.rating
    FROM 
      fundingoffer f
    JOIN 
      idea i ON f.ideaid = i.ideaid
    JOIN 
      innovator inv ON i.innovatorid = inv.innovatorid
    JOIN 
      review r ON i.ideaid = r.ideaid
    WHERE 
      r.status = 'تم التقييم'
    ORDER BY 
      f.offerdate DESC
  `;

  console.log("🔍 Executing query:", query);

  con.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching funding offers:", err);
      return res.status(500).json({ error: `❌ Error: ${err.message}` });
    }

    console.log(`✅ Successfully fetched ${results.length} funding offers`);
    if (results.length > 0) {
      console.log("📊 Sample of first result:", {
        fundingid: results[0].fundingid,
        title: results[0].title,
        innovator_name: results[0].innovator_name,
        moneyoffered: results[0].moneyoffered,
        funding_status: results[0].funding_status
      });
    }

    res.json(results);
  });
});


// أضف هذا في server.js
app.get("/api/check-user-role", async (req, res) => {
  const { email } = req.query;
  
  if (!email) {
    return res.status(400).json({ error: "البريد الإلكتروني مطلوب" });
  }
  
  try {
    const tables = ['innovator', 'mentor', 'reviewer', 'investor', 'admin'];
    const results = {};
    
    for (const table of tables) {
      try {
        const result = await con.query(
          `SELECT * FROM ${table} WHERE email = $1`,
          [email]
        );
        
        results[table] = {
          found: result.rows.length > 0,
          count: result.rows.length,
          data: result.rows.length > 0 ? result.rows[0] : null
        };
      } catch (tableError) {
        results[table] = {
          error: tableError.message,
          found: false
        };
      }
    }
    
    // تحديد الدور الفعلي
    let actualRole = null;
    for (const table of tables) {
      if (results[table].found) {
        actualRole = table;
        break;
      }
    }
    
    res.json({
      email,
      results,
      actualRole
    });
  } catch (error) {
    console.error("خطأ في فحص دور المستخدم:", error);
    res.status(500).json({ error: "خطأ داخلي في الخادم" });
  }
});
/*
app.post("/api/:table", async (req, res) => {
  const tableName = req.params.table;

  // ✅ تجنب التعارض مع المسار الخاص بـ idea
  if (tableName === "idea") {
      return res.status(400).json({ error: "❌ Use the dedicated route /api/idea for this table." });
  }

  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: "❌ No data provided for insertion." });
  }

  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");

  try {
      const result = await con.query(
          `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`,
          values
      );
      res.status(201).json({ message: "✅ Data inserted successfully", data: result.rows[0] });
  } catch (err) {
      console.error("❌ Insert Error:", err);
      res.status(500).json({ error: "❌ Error inserting data", details: err.message });
  }
});
*/
// تحديث بيانات في جدول معين باستخدام id
// Update the PUT endpoint to handle this special case
app.put("/api/:table/:id", async (req, res) => {
  const tableName = req.params.table;
  const id = req.params.id;
  const data = req.body;

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: "❌ لا توجد بيانات للتحديث." });
  }

  try {
    const keys = Object.keys(data);
    const values = Object.values(data);

    // ✅ Define correct id column names for special tables
    const idColumnMap = {
      fundingoffer: 'fundingid',
      mentorshiprequest: 'mentorshiprequestid',
      contract: 'contractid',
      mentorshiprequestsfrominnovators: 'request_id' // Add this special case
    };
    
    // Use the mapped column name or default to `${tableName}id`
    const idColumn = idColumnMap[tableName] || `${tableName}id`;

    const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

    const result = await con.query(
      `UPDATE ${tableName} SET ${updates} WHERE ${idColumn} = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "❌ لم يتم العثور على السجل المطلوب." });
    }

    res.json({ message: "✅ تم التحديث بنجاح", data: result.rows[0] });
  } catch (err) {
    console.error("❌ Update Error:", err);
    res.status(500).json({ error: "❌ خطأ في تحديث البيانات." });
  }
});
// Add this endpoint to your server file (app.js or index.js)

// PUT endpoint to update funding offer status
// Corrected PUT endpoint to update funding offer status
// Corrected PUT endpoint to update funding offer status
app.put("/api/fundingoffer/:id", async (req, res) => {
  console.log("🔸 Received PUT data for funding update:", req.body);
  console.log("🔸 Request ID:", req.params.id);

  try {
    const { status, comments } = req.body;
    const fundingId = req.params.id;

    if (!fundingId) {
      return res.status(400).json({ error: "Missing funding ID" });
    }

    // Validate status
    if (!status || !['accepted', 'rejected'].includes(status.toLowerCase())) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // First, let's log the table structure to debug
    console.log("Attempting to update funding offer with ID:", fundingId);
    
    // Query to check the table structure
    const tableInfo = await con.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = 'fundingoffer'`
    );
    
    console.log("Table structure:", tableInfo.rows);
    
    // Now attempt the update with the correct column name
    const result = await con.query(
      `UPDATE fundingoffer 
       SET status = $1, comments = $2
       WHERE fundingid = $3
       RETURNING *`,
      [status, comments, fundingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Funding offer not found" });
    }

    console.log("Update successful:", result.rows[0]);
    
    res.status(200).json({ 
      message: "Funding offer status updated successfully", 
      updatedOffer: result.rows[0] 
    });

  } catch (error) {
    console.error("❌ Error updating funding offer:", error);
    console.error("Error details:", error.message);
    
    // Return more detailed error information
    res.status(500).json({ 
      error: "Server error updating funding offer",
      details: error.message,
      code: error.code 
    });
  }
});
/*app.delete("/api/:table/:id", async (req, res) => {
    const tableName = req.params.table;
    const id = req.params.id;
    const idColumn = `${tableName}id`;

    try {
        const result = await con.query(`DELETE FROM ${tableName} WHERE ${idColumn} = $1 RETURNING *`, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "❌ لم يتم العثور على السجل المطلوب للحذف." });
        }

        res.json({ message: `✅ تم حذف الإدخال ذو id: ${id} من ${tableName}`, data: result.rows[0] });
    } catch (err) {
        console.error("❌ Delete Error:", err);
        res.status(500).json({ error: "❌ خطأ في حذف البيانات." });
    }
});*/

// Endpoint to accept a mentorship request
app.put("/api/mentorshiprequest/:id", async (req, res) => {
  console.log("🔸 Received PUT data for mentership update:", req.body);
  console.log("🔸 Request ID:", req.params.id);

  try {
    const { status, comments } = req.body;
    const fundingId = req.params.id;

    if (!fundingId) {
      return res.status(400).json({ error: "Missing mentorship ID" });
    }

    // Validate status
    if (!status || !['accepted', 'rejected'].includes(status.toLowerCase())) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // First, let's log the table structure to debug
    console.log("Attempting to update mentorship with ID:", mentorshiprequestid);
    
    // Query to check the table structure
    const tableInfo = await con.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = 'mentorshiprequest'`
    );
    
    console.log("Table structure:", tableInfo.rows);
    
    // Now attempt the update with the correct column name
    const result = await con.query(
      `UPDATE mentorshiprequest 
       SET status = $1,
       WHERE mentorshipid = $3
       RETURNING *`,
      [status, comments, fundingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "mentorship not found" });
    }

    console.log("Update successful:", result.rows[0]);
    
    res.status(200).json({ 
      message: "mentorship status updated successfully", 
      updatedOffer: result.rows[0] 
    });

  } catch (error) {
    console.error("❌ Error updating mentorship:", error);
    console.error("Error details:", error.message);
    
    // Return more detailed error information
    res.status(500).json({ 
      error: "Server error updating mentorship",
      details: error.message,
      code: error.code 
    });
  }
});
// Get user settings by ID and type
app.get("/api/user_settings/:user_id/:user_type", async (req, res) => {
  const { user_id, user_type } = req.params;

  try {
    console.log("📥 Fetching settings for:", user_id, user_type);

    const result = await con.query(
      `SELECT * FROM user_settings WHERE user_id = $1 AND user_type = $2`,
      [user_id, user_type]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Settings not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching user settings:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Insert or update user settings
app.post('/api/user_settings', async (req, res) => {
  const {
    user_id, user_type, name, gender, age, language, country,
    phone_code, phone, email, additional_emails,
    role_applied_for, role_reason, attachments
  } = req.body;

  try {
    // Validate required fields
    if (!user_id || !user_type) {
      return res.status(400).json({ 
        success: false, 
        error: "user_id and user_type are required" 
      });
    }

    // Clean inputs
    const cleanAttachments = Array.isArray(attachments)
      ? attachments.filter(a => typeof a === 'string' && a.trim() !== '')
      : [];
    
    const cleanEmails = Array.isArray(additional_emails)
      ? additional_emails.filter(e => typeof e === 'string' && e.trim() !== '')
      : [];

    // First check if record exists
    const checkResult = await con.query(
      `SELECT COUNT(*) FROM user_settings WHERE user_id = $1 AND user_type = $2`,
      [user_id, user_type]
    );
    
    let result;
    
    if (parseInt(checkResult.rows[0].count) > 0) {
      // Record exists - UPDATE
      console.log("⚙️ Updating existing record for", user_id, user_type);
      
      result = await con.query(
        `UPDATE user_settings SET
          name = $3,
          gender = $4,
          age = $5,
          language = $6,
          country = $7,
          phone_code = $8,
          phone = $9,
          email = $10,
          additional_emails = $11,
          role_applied_for = $12,
          role_reason = $13,
          attachments = $14,
          updated_at = NOW()
        WHERE user_id = $1 AND user_type = $2
        RETURNING *`,
        [
          user_id, user_type, name, gender, age, language, country,
          phone_code, phone, email, cleanEmails,
          role_applied_for, role_reason, cleanAttachments
        ]
      );
    } else {
      // Record doesn't exist - INSERT
      console.log("➕ Creating new record for", user_id, user_type);
      
      result = await con.query(
        `INSERT INTO user_settings (
          user_id, user_type, name, gender, age, language, country,
          phone_code, phone, email, additional_emails,
          role_applied_for, role_reason, attachments
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11,
          $12, $13, $14
        ) RETURNING *`,
        [
          user_id, user_type, name, gender, age, language, country,
          phone_code, phone, email, cleanEmails,
          role_applied_for, role_reason, cleanAttachments
        ]
      );
    }

    console.log("✅ Settings updated successfully");
    res.json({ 
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error("❌ Error updating user settings:", err);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error", 
      details: err.message 
    });
  }
});
app.get('/api/approvedsupervisions', async (req, res) => {
  try {
    const query = `
SELECT 
  'mentor' AS source,
  mreq.mentorshiprequestid AS request_id,
  mreq.mentorid,
  CONCAT(m.l_name, ' ', m.f_name) AS mentor_name,
  mreq.innovatorid,
  CONCAT(i.l_name, ' ', i.f_name) AS innovator_name,
  mreq.ideaid,
  idea.category,
  idea.title,
  NULL AS supervision_start_date
FROM mentorshiprequest AS mreq
JOIN idea ON mreq.ideaid = idea.ideaid
JOIN mentor AS m ON mreq.mentorid = m.mentorid
JOIN innovator AS i ON mreq.innovatorid = i.innovatorid
WHERE (mreq.status = 'مقبول' OR mreq.status = 'accepted')

UNION ALL

SELECT 
  'innovator' AS source,
  mreqs.request_id,
  mreqs.mentorid,
  CONCAT(m.l_name, ' ', m.f_name) AS mentor_name,
  mreqs.innovatorid,
  CONCAT(i.l_name, ' ', i.f_name) AS innovator_name,
  mreqs.ideaid,
  idea.category,
  idea.title,
  idea.supervision_start_date
FROM mentorshiprequestsfrominnovators AS mreqs
JOIN idea ON mreqs.ideaid = idea.ideaid
JOIN mentor AS m ON mreqs.mentorid = m.mentorid
JOIN innovator AS i ON mreqs.innovatorid = i.innovatorid
WHERE (mreqs.status = 'مقبول' or mreqs.status = 'accepted');

    `;
    const result = await db.query(query);
    
    // طباعة النتائج في السيرفر
    console.log('Result from DB:', result.rows);
    
    res.json(result.rows);
  } catch (error) {
    console.error('❌ هناك خطأ في جلب البيانات:', error);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});
app.get("/api/profile/:userid", async (req, res) => {
  const { userid } = req.params;

  try {
    const result = await con.query(`
      SELECT * FROM profiles WHERE user_id = $1
    `, [userid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "الملف غير موجود" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ error: "فشل في جلب بيانات البروفايل" });
  }
});
app.get("/api/reviewer-projects/:reviewerid", async (req, res) => {
  const { reviewerid } = req.params;

  try {
    const result = await con.query(`
      SELECT 
        r.reviewid,
        r.status,
        r.created_at AS evaluationdate,
        i.title,
        i.category,
        i.attachments
      FROM review r
      JOIN idea i ON r.ideaid = i.ideaid
      WHERE r.reviewerid = $1
      ORDER BY r.created_at DESC
    `, [reviewerid]);

    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching reviewer projects:", error);
    res.status(500).json({ error: "فشل في جلب المشاريع المُقيّمة" });
  }
});


app.get("/approvedideas", async (req, res) => {
  try {
    const result = await con.query(`SELECT * FROM approved_ideas_views`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching approved ideas:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

;app.get('/api/ideas_innovators', async (req, res) => {
  try {
    const query = `
      SELECT
      m.request_id,
      m.status,
      CONCAT(i.l_name, ' ', i.f_name) AS innovator_name,
      idea.title,
      idea.category,
      idea.description,
      idea.attachment
    FROM
     mentorshiprequestsfrominnovators m
    INNER JOIN
      idea ON m.ideaid = idea.ideaID
    INNER JOIN
      innovator i ON m.innovatorid = i.innovatorid
   WHERE
      m.status != 'مرفوض';
    `;

    const { rows } = await db.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('❌ Error fetching data:', error.message);
    res.status(500).json({ error: 'فشل في جلب البيانات', details: error.message });
  }
});  
// Fixed API endpoint for mentorship requests
// Update endpoint
app.put('/api/mentorshiprequestsfrominnovators/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await db('mentorshiprequestsfrominnovators')
      .where('request_id', id)
      .update({ status });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating mentorship request:', error);
    res.status(500).json({ error: 'Failed to update mentorship request' });
  }
});// GET route to fetch a specific supervision request by ID
app.get('/api/mentorshiprequestsfrominnovators/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM mentorshiprequestsfrominnovators WHERE request_id = $1`;
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supervision request not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching supervision request:', error);
    res.status(500).json({ error: 'Server error while fetching request' });
  }
});
// Fixed API endpoint for updating mentorship request status
app.put("/api/mentorshiprequest/:id", async (req, res) => {
  console.log("🔸 Received PUT data for mentorship request update:", req.body);
  console.log("🔸 Request ID:", req.params.id);

  try {
    const { status, comments } = req.body;
    const requestId = req.params.id;

    if (!requestId) {
      return res.status(400).json({ error: "Missing mentorship request ID" });
    }

    // Validate status
    if (!status || !['accepted', 'rejected', 'pending'].includes(status.toLowerCase())) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Format status with first letter capitalized
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    
    // Update the request with the given status - using the correct column names
    const result = await con.query(
      `UPDATE mentorshiprequestsfrominnovators 
       SET status = $1, comments = $2
       WHERE request_id = $3
       RETURNING *`,
      [formattedStatus, comments, requestId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mentorship request not found" });
    }

    console.log("✅ Update successful:", result.rows[0]);
    
    res.status(200).json({ 
      message: "Mentorship request status updated successfully", 
      updatedRequest: result.rows[0] 
    });

  } catch (error) {
    console.error("❌ Error updating mentorship request:", error);
    console.error("Error details:", error.message);
    
    res.status(500).json({ 
      error: "Server error updating mentorship request",
      details: error.message,
      code: error.code 
    });
  }
});

// نقطة نهاية لجلب البيانات من جدول الأفكار- والمبتكرين- وطلبات الاشراف من المبتكرين. في صفحه عرض طلبات الإشراف الجديدة بيج 9
app.get('/api/ideas-innovators', async (req, res) => {
  try {
    const query = `
    SELECT
      m.request_id,
      m.status,
      CONCAT(i.l_name, ' ', i.f_name) AS innovator_name,
      idea.title,
      idea.category,
      idea.description,
      idea.attachment,
      me.f_name AS mentor_fname,
      me.l_name AS mentor_lname
    FROM mentorshiprequestsfrominnovators m
    INNER JOIN idea ON m.ideaid = idea.ideaid
    INNER JOIN innovator i ON m.innovatorid = i.innovatorid
    INNER JOIN mentor me ON m.mentorid = me.mentorid
    WHERE m.status != 'مرفوض';
  `;
  
    const { rows } = await con.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('❌ Error fetching data:', error.message);
    res.status(500).json({ error: 'فشل في جلب البيانات', details: error.message });
  }
});  
app.put('/api/mentorship-requests/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updateQuery = `
      UPDATE mentorshiprequestsfrominnovators
      SET status = $1
      WHERE request_id = $2
    `;
    await con.query(updateQuery, [status, id]);
    res.status(200).json({ message: 'تم تحديث الحالة بنجاح' });
  } catch (error) {
    console.error('❌ Error updating status:', error.message);
    res.status(500).json({ error: 'فشل في تحديث الحالة', details: error.message });
  }
});
app.get('/api/mentorshiprequest/with-mentor-details', async (req, res) => {
  try {
    const query = `
      SELECT 
        mr.mentorshiprequestid,
        mr.status,
        mr.requestdate,
        mr.comment,
        mr.requesttype,
        
        -- Mentor information
        m.mentorid,
        m.f_name AS mentor_fname,
        m.l_name AS mentor_lname,
        
        -- Idea title
        i.title AS idea_title,
        
        -- Innovator name
        CONCAT(inv.f_name, ' ', inv.l_name) AS innovator_name

      FROM mentorshiprequest mr
      JOIN mentor m ON mr.mentorid = m.mentorid
      JOIN idea i ON mr.ideaid = i.ideaid
      JOIN innovator inv ON i.innovatorid = inv.innovatorid
      ORDER BY mr.requestdate DESC
    `;

    const result = await con.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching mentorship requests with full details:', error);
    res.status(500).json({ error: 'Database error' });
  }
});// Updated endpoint for changing mentorship request status
app.put('/api/mentorship-requests/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updateQuery = `
      UPDATE mentorshiprequestsfrominnovators
      SET status = $1
      WHERE request_id = $2
    `;
    await con.query(updateQuery, [status, id]);
    res.status(200).json({ message: 'تم تحديث الحالة بنجاح' });
  } catch (error) {
    console.error('❌ Error updating status:', error.message);
    res.status(500).json({ error: 'فشل في تحديث الحالة', details: error.message });
  }
});  
  ;app.put("/api/mentorshiprequest/:id", async (req, res) => {
  console.log("🔸 Received PUT data for mentorship request update:", req.body);
  console.log("🔸 Request ID:", req.params.id);

  try {
    const { status, comments } = req.body;
    const requestId = req.params.id;

    if (!requestId) {
      return res.status(400).json({ error: "Missing mentorship request ID" });
    }

    // Validate status
    if (!status || !['accepted', 'rejected', 'pending'].includes(status.toLowerCase())) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Format status with first letter capitalized
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    
    // Update the request with the given status
    const result = await con.query(
      `UPDATE mentorshiprequest 
       SET status = $1, comments = $2
       WHERE mentorshiprequestid = $3
       RETURNING *`,
      [formattedStatus, comments, requestId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mentorship request not found" });
    }

    console.log("✅ Update successful:", result.rows[0]);
    
    res.status(200).json({ 
      message: "Mentorship request status updated successfully", 
      updatedRequest: result.rows[0] 
    });

  } catch (error) {
    console.error("❌ Error updating mentorship request:", error);
    console.error("Error details:", error.message);
    
    res.status(500).json({ 
      error: "Server error updating mentorship request",
      details: error.message,
      code: error.code 
    });
  }
});  

// API لاستدعاء OpenAI GPT-3.5
app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: message }]
            },
            {
                headers: { 
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("❌ OpenAI API Error:", error);
        res.status(500).json({ error: "❌ خطأ في الاتصال بـ OpenAI API." });
    }
});

app.get('/api/mentorshiprequest', async (req, res) => {
  try {
    console.log("📥 Fetching mentorship requests with joins");

    const result = await con.query(`
      
    SELECT mr.*, 
           m.f_name AS mentor_fname, 
           m.l_name AS mentor_lname
    FROM mentorshiprequest mr
    JOIN mentor m ON mr.mentorid = m.mentorid
    ORDER BY mr.requestdate DESC
  ` );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching mentorship requests:", err);
    res.status(500).json({ error: `❌ Error: ${err.message}` });
  }
});
app.post("/mentorshiprequest", async (req, res) => {
  try {
    const { innovatorid, mentorid, ideaid, requestdate, status,comment } = req.body;
    const newRequest = await con.query(
      "INSERT INTO mentorshiprequest (innovatorid, mentorid, ideaid, requestdate, status,comment) VALUES ($1, $2, $3, $4, $5,$6) ",
      [innovatorid, mentorid, ideaid, requestdate, status,comment]
    );
    res.json("تم إرسال طلب الإشراف");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("خطأ في الخادم");
  }
});

app.get("/api/fundingoffer", async (req, res) => {
  try {
      const query = `
SELECT 
  f.fundingid,
  f.moneyoffered,
  f.status AS funding_status,
  f.offerdate,
  i.title AS idea_name,
  inv.f_name,
  inv.l_name,
  CONCAT(inv.f_name, ' ', inv.l_name) AS innovator_name
FROM fundingoffer f
JOIN idea i ON f.ideaid = i.ideaid
JOIN innovator inv ON f.innovatorid = inv.innovatorid
ORDER BY f.fundingid DESC

      `;
      

    con.query(query, (error, results) => {
      if (error) {
        console.error("Error fetching funding offers:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      res.status(200).json(results);
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
app.post("/api/ai-evaluation", async (req, res) => {
  const { ideaid, feedbacktext, evaluationdate } = req.body;
  
  // التحقق من وجود البيانات المطلوبة
  if (!ideaid || !feedbacktext) {
    return res.status(400).json({ error: "يجب توفير معرف الفكرة ونص التقييم" });
  }
  
  try {
    // إدخال التقييم في قاعدة البيانات
    const query = `
      INSERT INTO ai_evaluation 
      (ideaid, feedbacktext, evaluationdate) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    
    const values = [
      ideaid,
      feedbacktext,
      evaluationdate || new Date().toISOString()
    ];
    
    const result = await con.query(query, values);
    
    res.status(201).json({
      message: " تم حفظ تقييم الذكاء الاصطناعي بنجاح",
      evaluation: result.rows[0]
    });
    
  } catch (error) {
    console.error(" خطأ في حفظ تقييم الذكاء الاصطناعي:", error);
    res.status(500).json({ error: "خطأ في حفظ التقييم في قاعدة البيانات" });
  }
});

// الحصول على تقييمات الذكاء الاصطناعي حسب معرف الفكرة
app.get("/api/ai-evaluation/idea/:ideaId", async (req, res) => {
  const { ideaId } = req.params;
  
  try {
    const query = `
      SELECT * FROM ai_evaluation 
      WHERE ideaid = $1 
      ORDER BY evaluationdate DESC
    `;
    
    const result = await con.query(query, [ideaId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error(" خطأ في استرجاع تقييمات الذكاء الاصطناعي:", error);
    res.status(500).json({ error: "خطأ في استرجاع التقييمات من قاعدة البيانات" });
  }
});

// الحصول على تقييم الذكاء الاصطناعي حسب معرف التقييم
app.get("/api/ai-evaluation/:evaluationId", async (req, res) => {
  const { evaluationId } = req.params;
  
  try {
    const query = `
      SELECT * FROM ai_evaluation 
      WHERE evaluationid = $1
    `;
    
    const result = await con.query(query, [evaluationId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "التقييم غير موجود" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(" خطأ في استرجاع تقييم الذكاء الاصطناعي:", error);
    res.status(500).json({ error: "خطأ في استرجاع التقييم من قاعدة البيانات" });
  }
});

// تحديث تقييم الذكاء الاصطناعي
app.put("/api/ai-evaluation/:evaluationId", async (req, res) => {
  const { evaluationId } = req.params;
  const { feedbacktext } = req.body;
  
  if (!feedbacktext) {
    return res.status(400).json({ error: "يجب توفير نص التقييم المحدث" });
  }
  
  try {
    const query = `
      UPDATE ai_evaluation 
      SET feedbacktext = $1, evaluationdate = CURRENT_TIMESTAMP 
      WHERE evaluationid = $2 
      RETURNING *
    `;
    
    const result = await con.query(query, [feedbacktext, evaluationId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "التقييم غير موجود" });
    }
    
    res.json({
      message: " تم تحديث تقييم الذكاء الاصطناعي بنجاح",
      evaluation: result.rows[0]
    });
  } catch (error) {
    console.error(" خطأ في تحديث تقييم الذكاء الاصطناعي:", error);
    res.status(500).json({ error: "خطأ في تحديث التقييم في قاعدة البيانات" });
  }
});

// حذف تقييم الذكاء الاصطناعي
app.delete("/api/ai-evaluation/:evaluationId", async (req, res) => {
  const { evaluationId } = req.params;
  
  try {
    const query = `
      DELETE FROM ai_evaluation 
      WHERE evaluationid = $1 
      RETURNING *
    `;
    
    const result = await con.query(query, [evaluationId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "التقييم غير موجود" });
    }
    
    res.json({
      message: "✅ تم حذف تقييم الذكاء الاصطناعي بنجاح",
      evaluation: result.rows[0]
    });
  } catch (error) {
    console.error("❌ خطأ في حذف تقييم الذكاء الاصطناعي:", error);
    res.status(500).json({ error: "خطأ في حذف التقييم من قاعدة البيانات" });
  }
});
// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// إغلاق الاتصال عند إيقاف السيرفر
process.on("SIGINT", async () => {
    await con.end();
    console.log("🛑 PostgreSQL connection closed");
    process.exit(0);
});