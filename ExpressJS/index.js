const app = require('./src/app.js'); // app này đã có router đầy đủ bên trong
const PORT = 8081;

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
