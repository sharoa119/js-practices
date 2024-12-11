#!/usr/bin/env node

import { MemoApp } from "./memo_app.js"; // メインのアプリケーションをインポート

// MemoAppのインスタンスを作成し、アプリを開始
const memo = new MemoApp();
memo.start();
