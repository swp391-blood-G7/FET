const app = require('./src/app.js');
const PORT = 8081;
const loginRouter = require('./routes/login');
app.use('/api/auth', loginRouter);

const registerRouter = require('./routes/register');
app.use('/api/auth', registerRouter);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});