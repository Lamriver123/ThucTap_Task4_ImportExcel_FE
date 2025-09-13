const express = require('express');
const path = require('path');

const app = express();

// Thư mục build Angular browser
const browserDist = path.join(__dirname, 'dist/import_product_fe/browser');

app.use(express.static(browserDist));

// Fallback cho Angular SPA (dùng /* thay vì *)
app.use((req, res) => {
  res.sendFile(path.join(browserDist, 'index.html'));
});


// Cổng do Azure App Service cấp
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`✅ Angular app is running on port ${port}`);
});
