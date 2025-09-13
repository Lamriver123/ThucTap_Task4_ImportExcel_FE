const express = require('express');
const path = require('path');

const app = express();

// Thư mục build Angular browser
const browserDist = path.join(__dirname, '../dist/import_product_fe/browser');

app.use(express.static(browserDist));

// Route fallback cho Angular SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(browserDist, 'index.html'));
});

// Cổng do Azure App Service cấp qua biến môi trường
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
