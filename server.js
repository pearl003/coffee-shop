const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 连接 MySQL 数据库
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "yourpassword",  // 替换成你的 MySQL 密码
    database: "coffee_shop"
});

db.connect((err) => {
    if (err) {
        console.error("❌ 数据库连接失败:", err);
    } else {
        console.log("✅ 已连接到 MySQL 数据库！");
    }
});

// 提交订单 API
app.post("/order", (req, res) => {
    const { user, items, total_price } = req.body;
    
    if (!user || !items || total_price <= 0) {
        return res.status(400).json({ error: "订单信息不完整" });
    }

    const sql = "INSERT INTO orders (user, items, total_price, status) VALUES (?, ?, ?, 'pending')";
    db.query(sql, [user, JSON.stringify(items), total_price], (err, result) => {
        if (err) {
            console.error("❌ 插入订单失败:", err);
            return res.status(500).json({ error: "数据库错误" });
        }
        res.json({ message: "订单已提交！", order_id: result.insertId });
    });
});

// 监听端口 3000
app.listen(3000, () => {
    console.log("🚀 服务器运行在 http://localhost:3000");
});
