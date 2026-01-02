import fs from 'fs';

// تابع تبدیل اعداد انگلیسی به فارسی
const toPersianDigits = (num) => {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, x => farsiDigits[x]);
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// تولید تاریخ تصادفی و تبدیل فوری به فارسی
const getRandomDate = () => {
  const year = getRandomInt(1402, 1403);
  const month = String(getRandomInt(1, 12)).padStart(2, '0');
  const day = String(getRandomInt(1, 28)).padStart(2, '0');
  // خروجی فارسی برمی‌گرداند: ۱۴۰۲/۰۵/۱۲
  return toPersianDigits(`${year}/${month}/${day}`);
};

const descriptions = [
  "خرید سوپرمارکت", "هزینه اینترنت", "شارژ ساختمان", "حقوق ماهانه",
  "فروش ارز دیجیتال", "کرایه تاکسی", "خرید لباس", "هزینه تعمیرات",
  "پاداش شرکت", "واریز سود بانکی", "خرید کتاب", "کافه و رستوران"
];

const generateData = () => {
  const users = [
    {
      "id": "1",
      "email": "admin@gmail.com",
      "password": "123",
      "name": "مدیر سیستم"
    },
    {
      "id": "2",
      "email": "user@gmail.com",
      "password": "456",
      "name": "کاربر عادی"
    }
  ];

  const transactions = [];

  console.log("⏳ در حال تولید ۱۰,۰۰۰ تراکنش با تاریخ فارسی...");
  
  for (let i = 1; i <= 100000; i++) {
    const type = Math.random() > 0.4 ? "expense" : "income";
    const amount = getRandomInt(10000, 5000000);
    
    transactions.push({
      id: i.toString(),
      amount: amount, // مبلغ را عددی نگه می‌داریم تا محاسبات نمودار خراب نشود
      type: type,
      date: getRandomDate(), // تاریخ حالا فارسی ذخیره می‌شود
      description: descriptions[getRandomInt(0, descriptions.length - 1)] + ` - تراکنش ${toPersianDigits(i)}`,
      userId: Math.random() > 0.5 ? "1" : "2"
    });
  }

  const dbData = {
    users: users,
    transactions: transactions
  };

  fs.writeFileSync('db.json', JSON.stringify(dbData, null, 2));
  console.log("✅ فایل db.json با تاریخ‌های فارسی آپدیت شد!");
};

generateData();