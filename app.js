const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const swagger = require('./configs/apiDoc/swaggerRoutes');
const { setHeaders } = require('./middlewares/headers')

app.use(helmet());
app.use(express.json())
app.use(bodyParser.urlencoded({ limit: "20mb", extended: false }))
app.use(bodyParser.json())
app.use(morgan('combined'))
app.use(cookieParser("rtujh57uhHG)B$&ghy073hy57hbHB)$&BH)Hb85h4b84bhe8hb*BH#$*B"))
app.use("/villa/covers", express.static(path.join(__dirname, 'public', 'covers')));
app.use("/api-doc", swagger)
app.use(setHeaders);
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

//* Middlewares ^

const authRouter = require('./modules/auth/router')
const codeRouter = require('./modules/authcode/router')
const userRouter = require('./modules/users/router')
const banRouter = require('./modules/ban/router')
const villaRouter = require('./modules/villas/router')
const newsletterRouter = require('./modules/newsletter/router')
const notificationRouter = require('./modules/notification/router')
const commentRouter = require('./modules/comment/router')
const categoryRouter = require('./modules/category/router')

// Routers ^

app.use("/", authRouter)
app.use("/auth/E-code", codeRouter)
app.use("/users/", userRouter)
app.use("/villa/", villaRouter)
app.use("/ban/", banRouter)
app.use("/notification/", notificationRouter)
app.use("/newsletter/", newsletterRouter)
app.use("/comment/", commentRouter)
app.use("/category/", categoryRouter)

// Routers Middleware ^

app.use((req, res) => {
    return res.status(404).json({ message: "page not found 404" })
})

app.use((err, req, res, next) => {
    return res.status(500).json({ error: { message: err }, });
});
// Static Routes ^

module.exports = app;