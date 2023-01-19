import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from 'cors'
import dotenv from 'dotenv'
import('./socketio/io')

dotenv.config()
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/api', apiRouter)

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
    next(createError(404));
});

// error handler
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(500);
    res.render('error');
    res.json({
        ...err
    })
    return res.send()
});

module.exports = app;
